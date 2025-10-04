import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CarDetails from '../Components/CarBooking/CarDetails';
import Location from '../Components/CarBooking/Location';
import DateTime from '../Components/CarBooking/DateTime';
import PersonalInfo from '../Components/CarBooking/PersonalInfo';
import { AppDispatch, RootState } from '../store/store';
import { editBooking, getBookingDetails, getLocations } from '../slices/ThunkAPI/ThunkAPI';
import { useAlert } from '../Components/AlertProvider';

interface SelectedDate {
    pickupDate: Date | null;
    dropoffDate: Date | null;
    pickupTime: string | null;
    dropoffTime: string | null;
}

const EditBooking: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const showAlert = useAlert();

    const { bookingId } = useParams();
    const user = useSelector((state: RootState) => state.auth.user);
    const reduxLocations = useSelector((state: RootState) => state.homepage.locations);
    const { EditBookingLoading, EditBookingError } = useSelector((state: RootState) => state.booking);

    const [carDetails, setCarDetails] = useState<any>(null);
    const [transformedCarDetails, setTransformedCarDetails] = useState<any>(null);
    const [location, setLocation] = useState({
        pickupLocationId: '',
        dropoffLocationId: '',
    });

    const [dates, setDates] = useState<SelectedDate>({
        pickupDate: null,
        pickupTime: null,
        dropoffDate: null,
        dropoffTime: null,
    });
    const [allowDates, setAllowDates] = useState<string[]>([]);

    const personalInfo = useMemo(
        () => ({
            name: user?.username || '',
            email: user?.email || '',
            phone: user?.phoneNumber || '',
        }),
        [user]
    );

    //initialstate
    const [initialLocation, setInitialLocation] = useState({ pickupLocationId: '', dropoffLocationId: '' });
    const [initialDates, setInitialDates] = useState<SelectedDate>({
        pickupDate: null,
        pickupTime: null,
        dropoffDate: null,
        dropoffTime: null,
    });

    const getLocationNameById = useCallback(
        (id: string) => {
            const location = reduxLocations.find((loc) => loc.locationId === id);
            return location?.locationName || 'Unknown Location';
        },
        [reduxLocations]
    );

    const bookingDays = useMemo(() => {
        if (dates.pickupDate && dates.dropoffDate) {
            const timeDifference = dates.dropoffDate.getTime() - dates.pickupDate.getTime();
            const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
            return Math.max(days + 1, 1);
        }
        return 1;
    }, [dates]);

    const isChanged = useMemo(() => {
        const datesEqual = (
            initialDates.pickupDate?.toISOString() === dates.pickupDate?.toISOString() &&
            initialDates.pickupTime === dates.pickupTime &&
            initialDates.dropoffDate?.toISOString() === dates.dropoffDate?.toISOString() &&
            initialDates.dropoffTime === dates.dropoffTime
        );

        const locationsEqual = (
            initialLocation.pickupLocationId === location.pickupLocationId &&
            initialLocation.dropoffLocationId === location.dropoffLocationId
        );

        return !(datesEqual && locationsEqual);
    }, [initialDates, dates, initialLocation, location]);


    const generateDateRange = useCallback((startDate: Date, endDate: Date): string[] => {
        const dateArray: string[] = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dateArray.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateArray;
    }, []);

    useEffect(() => {
        if (!user?.idToken || !bookingId) return;

        if (reduxLocations.length === 0) {
            dispatch(getLocations())
                .catch((err) => console.error('Error fetching locations:', err));
        }

        dispatch(getBookingDetails({ bookingId, token: user.idToken }))
            .unwrap()
            .then((data) => {
                const { pickupLocation, dropoffLocation, bookingPeriod, car } = data;

                setLocation({
                    pickupLocationId: pickupLocation?.id || '',
                    dropoffLocationId: dropoffLocation?.id || '',
                });
                setInitialLocation({
                    pickupLocationId: pickupLocation?.id || '',
                    dropoffLocationId: dropoffLocation?.id || '',
                });

                const pickupDateObj = new Date(bookingPeriod.pickupDateTime);
                const dropoffDateObj = new Date(bookingPeriod.dropoffDateTime);

                const pervBookedDates = {
                    pickupDate: pickupDateObj,
                    pickupTime: pickupDateObj.toTimeString().slice(0, 5),
                    dropoffDate: dropoffDateObj,
                    dropoffTime: dropoffDateObj.toTimeString().slice(0, 5),
                };

                setDates(pervBookedDates);
                setInitialDates(pervBookedDates);

                setAllowDates(generateDateRange(pickupDateObj, dropoffDateObj));
                setCarDetails(car);

                const transformed = {
                    CarImage: car.image,
                    CarName: car.model,
                    TotalPrice: car.pricePerDay * bookingDays,
                    Location: getLocationNameById(pickupLocation?.id),
                    DipositAmt: 2000,
                };
                setTransformedCarDetails(transformed);
            })
            .catch((err) => {
                showAlert({
                    type: 'error',
                    title: 'Error',
                    subtitle: err?.message || 'Failed to fetch booking details. Please try again.',
                });
            });
    }, [bookingId, user?.idToken, reduxLocations, generateDateRange, getLocationNameById]);

    useEffect(() => {
        if (!carDetails) return;

        setTransformedCarDetails((prev: any) => ({
            ...prev,
            TotalPrice: carDetails.pricePerDay * bookingDays,
        }));
    }, [bookingDays, carDetails]);



    const confirmEdit = async () => {
        if (!user?.idToken || !bookingId) return;

        // Set pickup datetime
        const pickupDateTime = new Date(dates.pickupDate!);
        const [pickupHours, pickupMinutes] = dates.pickupTime!.split(':').map(Number);
        pickupDateTime.setHours(pickupHours, pickupMinutes);

        // Set dropoff datetime
        const dropoffDateTime = new Date(dates.dropoffDate!);
        const [dropoffHours, dropoffMinutes] = dates.dropoffTime!.split(':').map(Number);
        dropoffDateTime.setHours(dropoffHours, dropoffMinutes);

        // Format date to "YYYY-MM-DD HH:mm"
        const formatDateTime = (date: Date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const hh = String(date.getHours()).padStart(2, '0');
            const min = String(date.getMinutes()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
        };

        const updatedData = {
            pickupLocationId: location.pickupLocationId,
            dropoffLocationId: location.dropoffLocationId,
            pickupDateTime: formatDateTime(pickupDateTime),
            dropoffDateTime: formatDateTime(dropoffDateTime),
        };

        try {
            await dispatch(editBooking({
                bookingId,
                userId: user.userId + "",
                token: user.idToken + "",
                updatedData
            })).unwrap();

            showAlert({
                type: 'success',
                title: 'Booking Updated',
                subtitle: 'Your booking has been successfully updated.',
            });

            navigate('/my-bookings');
        } catch (error) {
            showAlert({
                type: 'error',
                title: 'Update Failed',
                subtitle: EditBookingError || 'Something went wrong while updating your booking.',
            });
        }
    };


    return (
        <div>
            {/* Breadcrumb Navigation */}
            <div className="pl-9 text-sm text-black inline-flex items-center space-x-1">
                <span className="text-gray-400 font-semibold cursor-pointer" onClick={() => navigate('/my-bookings')}>
                    My Bookings
                </span>
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.4409 9.17597C10.4966 9.12019 10.5628 9.07593 10.6356 9.04574C10.7084 9.01554 10.7865 9 10.8654 9C10.9442 9 11.0223 9.01554 11.0951 9.04574C11.168 9.07593 11.2341 9.12019 11.2899 9.17597L13.6899 11.576C13.8022 11.6885 13.8653 11.841 13.8653 12C13.8653 12.159 13.8022 12.3115 13.6899 12.424L11.2899 14.824C11.2342 14.8798 11.1681 14.9241 11.0953 14.9543C11.0225 14.9846 10.9444 15.0002 10.8656 15.0003C10.7867 15.0004 10.7086 14.985 10.6358 14.9549C10.5629 14.9248 10.4967 14.8807 10.4409 14.825C10.385 14.7693 10.3408 14.7032 10.3105 14.6304C10.2802 14.5576 10.2646 14.4795 10.2645 14.4007C10.2644 14.3218 10.2799 14.2438 10.31 14.1709C10.34 14.098 10.3842 14.0318 10.4399 13.976L12.4179 12L10.4419 10.024C10.3295 9.91147 10.2664 9.75897 10.2664 9.59997C10.2664 9.44097 10.3285 9.28847 10.4409 9.17597Z" fill="black" />
                </svg>
                <span className="text-black font-semibold">Edit Booking</span>
            </div>

            {/* Main Content */}
            <div className="min-h-screen p-2 text-black">
                <h1 className="text-5xl font-bold mb-8 ml-6 mt-5">Edit Booking</h1>
                <div className="flex flex-col md:flex-row space-x-0 md:space-x-5">
                    {/* Left Column: Personal Info, Location, and Date/Time */}
                    <div className="flex flex-col pt-6 pl-6 p-4 w-full md:w-[32%]">
                        {user?.userId && <PersonalInfo info={personalInfo} />}
                        <Location
                            location={location}
                            setLocation={setLocation}
                            locations={reduxLocations}
                            allowedLocationIds={carDetails?.locations?.map((loc: { id: string }) => loc.id) ?? []}
                        />
                        <DateTime
                            mode="editing"
                            dates={dates}
                            setDate={setDates}
                            carId={carDetails?.id}
                            allowDates={allowDates}
                        />
                    </div>
                    {/* Right Column: Car Details and Confirm Button */}
                    <div className="w-full p-5 md:p-0 md:w-[50%] md:mt-16 mx-auto">
                        {transformedCarDetails && (
                            <CarDetails
                                carData={transformedCarDetails}
                                role="editing"
                                func={confirmEdit}
                                isDisabled={!isChanged || EditBookingLoading}
                                isLoading={EditBookingLoading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditBooking;
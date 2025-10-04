import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../Components/AlertProvider';
import { AppDispatch, RootState } from "../store/store";
import { EndPoint } from '../utils';
import CarImageViewer from '../Components/Cars/CarImageViewer';
import LazyCarDetailLoader from '../Components/Cars/LazyCarDetailSkeleton';
import { getBookingDetails, getLocations } from '../slices/ThunkAPI/ThunkAPI';
import CarDetailsCard from '../Components/Cars/CarDetailsCard';
import FeedbackList from '../Components/Cars/FeedbackList';
import OrderSummeryPrices from '../Components/MyBookings/OrderSummeryPrices';

interface ModalProps {
    onClose: () => void;
    isOpen: boolean;
    Details: {
        carId: string,
        orderId: string,
        status: string
    }
}

type CarStatus =
  | "reserved"
  | "reservedBySA"
  | "serviceStarted"
  | "serviceProvided"
  | "serviceFinished"
  | "canceled";

interface CarDetails {
    carId: string;
    carRating: number;
    climateControlOption: string;
    engineCapacity: string;
    fuelConsumption: string;
    fuelType: string;
    gearBoxType: string;
    images: string[];
    location: string;
    locationIds: string[];
    model: string;
    passengerCapacity: string;
    pricePerDay: number;
    serviceRating: number;
    status: string;
}

export interface BookingDetails {
    status: CarStatus;
    daysBooked?: number;
    pickupLocationName: string;
    dropoffLocationName: string;
    pickupLocationUrl?: string;
    dropoffLocationUrl?: string;
}

const OrderSummery: React.FC<ModalProps> = ({ onClose, isOpen, Details }) => {
    const myalert = useAlert();
    const dispatch = useDispatch<AppDispatch>();
    const [carDetails, setCarDetails] = useState<CarDetails | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const [loading, setLoading] = useState<boolean>(true);
    const [BookingDetailsData, setBookingDetailsData] = useState<BookingDetails>();
    const reduxLocations = useSelector((state: RootState) => state.homepage.locations);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const getLocationById = useCallback(
    (id: string) => {
        const location = reduxLocations.find((loc) => loc.locationId === id);
        return {
            name: location?.locationName || 'Unknown Location',
            url: location?.locationAddress || '#'
        };
    },
    [reduxLocations]
);

    useEffect(() => {
        if (Details?.carId) {
            setLoading(true);
            fetch(`${EndPoint}/cars/${Details.carId}`)
                .then((response) => response.json())
                .then((data) => {
                    setCarDetails(data);
                    setLoading(false);
                })
                .catch((error) => {
                    myalert({
                        type: "error",
                        title: "Error!",
                        subtitle: error?.message + " Please try after some time.",
                    });
                    onClose();
                    setLoading(false);
                });
        }
    }, [Details?.carId, myalert, onClose]);

    useEffect(() => {
        if (!user?.idToken || !Details?.orderId) {
            return;
        }
        else {
            if (reduxLocations.length === 0) {
                dispatch(getLocations())
                    .unwrap()
                    .catch((err) => console.error("Error fetching locations:", err));
                return;
            }

            dispatch(getBookingDetails({ bookingId: Details.orderId, token: user.idToken }))
                .unwrap()
                .then((data: any) => {
                    const pickup = new Date(data.bookingPeriod.pickupDateTime);
                    const dropoff = new Date(data.bookingPeriod.dropoffDateTime);
                    const days = Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));

                    // ✅ filter out location IDs
                    const pickupLocation = getLocationById(data.pickupLocation.id);
                    const dropoffLocation = getLocationById(data.dropoffLocation.id);

                    // ✅ store processed data
                    setBookingDetailsData({
                        status: data.status.toLowerCase(),
                        daysBooked: days,
                        pickupLocationName: pickupLocation.name,
                        dropoffLocationName: dropoffLocation.name,
                        pickupLocationUrl: pickupLocation.url,
                        dropoffLocationUrl: dropoffLocation.url
                    });

                })
                .catch((err: any) => {
                    myalert({
                        type: 'error',
                        title: 'Error',
                        subtitle: err?.message || 'Failed to fetch booking details. Please try again.',
                    });
                });
        }
    }, [Details.orderId, user?.idToken,reduxLocations]);

    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[75] p-2 sm:p-4"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-[#FFFBF3] p-4 sm:p-6 md:p-10 rounded-xl w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] h-[90vh] shadow-lg relative overflow-y-auto overflow-x-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-3 sm:right-5 text-2xl sm:text-3xl font-bold 
             bg-white/70 sm:bg-transparent rounded-full px-2 sm:px-0 
             cursor-pointer z-10"
                    aria-label="Close modal"
                    onClick={onClose}
                >
                    &times;
                </button>

                {loading ? (
                    <LazyCarDetailLoader size={1} />
                ) : (
                    <>
                        <div className="flex flex-col lg:flex-row gap-5 items-start w-full">
                            <CarImageViewer
                                images={carDetails?.images || []}
                                className="w-full lg:w-[60%]"
                            />
                            <div className='flex flex-col w-full gap-4'>
                                <CarDetailsCard
                                    car={{
                                        name: carDetails?.model || "",
                                        carId: carDetails?.carId || "",
                                        carRating: carDetails?.carRating.toString() || "",
                                        gearBoxType: carDetails?.gearBoxType || "-",
                                        fuelType: carDetails?.fuelType || "-",
                                        fuelConsumption: carDetails?.fuelConsumption || "-",
                                        climateControlOption: carDetails?.climateControlOption || "-",
                                        engineCapacity: carDetails?.engineCapacity || "-",
                                        passengerCapacity: carDetails?.passengerCapacity || "-",
                                        LocationDetails: {
                                            pickupLocationName: BookingDetailsData?.pickupLocationName,
                                            dropoffLocationName: BookingDetailsData?.dropoffLocationName,
                                            pickupLocationUrl: BookingDetailsData?.pickupLocationUrl,
                                            dropoffLocationUrl: BookingDetailsData?.dropoffLocationUrl
                                        },
                                        status: BookingDetailsData?.status
                                    }}
                                    showBookingOptions={false}
                                    className='w-full'
                                />
                                <OrderSummeryPrices
                                    days={BookingDetailsData?.daysBooked}
                                    pricePerDay={carDetails?.pricePerDay || 0}
                                />
                            </div>
                        </div>
                        <div className="mt-6 sm:mt-8 w-full">
                            <FeedbackList carId={carDetails?.carId || "-"} />
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}

export default OrderSummery
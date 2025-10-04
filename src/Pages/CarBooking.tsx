import React, { useEffect, useMemo, useState } from "react";
import PersonalInfo from "../Components/CarBooking/PersonalInfo";
import Location from "../Components/CarBooking/Location";
import DateTime from "../Components/CarBooking/DateTime";
import CarDetails from "../Components/CarBooking/CarDetails";
import CarAlreadyReserved from "../Modals/CarAlreadyReserved";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmReservation,
  fetchNotifications,
  getCarDetailsById,
  getLocations,
} from "../slices/ThunkAPI/ThunkAPI";
import { resetBookingStatus } from "../slices/BookingSlices";
import { AppDispatch, RootState } from "../store/store";
import { useAlert } from "../Components/AlertProvider";
import Button from "../Components/Button";
import { useThrottledCallback } from "../Misc/ThrottleComponent";
import type { LocationOption } from "../Components/CarBooking/Location";

interface SelectedDate {
  pickupDate: Date | null;
  dropoffDate: Date | null;
  pickupTime: string | null;
  dropoffTime: string | null;
}


const CarBooking: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const nav = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const showAlert = useAlert();
  const UserId = useSelector((state: RootState) => state.auth.user?.userId);
  const User = useSelector((state: RootState) => state.auth.user);
  const UserIdToken = useSelector((state: RootState) => state.auth.user?.idToken);
  const homepageState = useSelector((state: RootState) => state.homepage);
  const bookingStatus = useSelector((state: RootState) => state.booking);
  const carState = useSelector((state: RootState) => state.cars);
  const { carDetails, error: carError } = carState;
  const { locations: reduxLocations } = homepageState;
  const { error, success } = bookingStatus;

  const [IsNotAvailable, setIsNotAvailable] = useState(false);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [location, setLocation] = useState({
    pickupLocationId: "",
    dropoffLocationId: "",
  });

  const useBookingQueryParams = (): SelectedDate => {
    const { search } = useLocation();
    return useMemo(() => {
      const query = new URLSearchParams(search);
      const now = new Date();
      return {
        pickupDate: query.get("pickupDate") ? new Date(query.get("pickupDate")!) : now,
        pickupTime: query.get("pickupTime"),
        dropoffDate: query.get("dropoffDate") ? new Date(query.get("dropoffDate")!) : now,
        dropoffTime: query.get("dropoffTime"),
      };
    }, [search]);
  };

  const { pickupDate, pickupTime, dropoffDate, dropoffTime } = useBookingQueryParams();

  const [dates, setDates] = useState<SelectedDate>({
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
  });

  const [personalInfo] = useState({
    name: User?.username,
    email: User?.email ?? "",
    phone: User?.phoneNumber ?? "",
  });

  useEffect(() => {
    if (!UserId) {
      showAlert({
        type: "error",
        title: "You are not logged in!",
        subtitle:
          "To continue booking a car, you need to log in or create an account",
        buttons: (
          <>
            <Button type="outline" width="w-20" onClick={() => nav("/")}>Cancel</Button>
            <Button type="filled" width="w-20" onClick={() => nav("/login")}>Login</Button>
          </>
        ),
      });
    }
  }, [UserId, showAlert, nav]);

  useEffect(() => {
    if (!carId) {
      nav("/cars", { replace: true });
      return;
    }
    dispatch(getCarDetailsById(carId));
    dispatch(getLocations());
  }, [carId, dispatch, nav]);

  useEffect(() => {
    if (carError) {
      showAlert({
        type: "error",
        title: "Oops",
        subtitle: `Something went wrong`,
      });
      nav("/cars", { replace: true });
    }
  }, [carError, nav, showAlert]);

  useEffect(() => {
    const carLocationIds = carDetails?.locationIds ?? [];

    if (reduxLocations.length > 0 && carLocationIds.length > 0) {
      const firstCarLocationId = carLocationIds[0];

      if (location.pickupLocationId !== firstCarLocationId) {
        setLocation({
          pickupLocationId: firstCarLocationId,
          dropoffLocationId: firstCarLocationId,
        });
      }

      setLocations(reduxLocations);
    } else if (reduxLocations.length > 0) {
      const defaultId = reduxLocations[0].locationId;

      setLocation((prev) => ({
        pickupLocationId: prev.pickupLocationId || defaultId,
        dropoffLocationId: prev.dropoffLocationId || defaultId,
      }));

      setLocations(reduxLocations);
    } else {
      // Fallback if no locations available
      setLocations([
        {
          locationId: "none",
          locationName: "No pickup/drop-off currently available",
          locationAddress: "-",
          locationImageUrl: "",
        },
      ]);
      setLocation({
        pickupLocationId: "none",
        dropoffLocationId: "none",
      });
    }
  }, [reduxLocations, carDetails?.locationIds]);



  const HandleConfirmReservation = async () => {
    if (!carId || !UserId || !dates.pickupDate || !dates.dropoffDate) return;

    if (!dates.pickupDate || !dates.pickupTime || !dates.dropoffDate || !dates.dropoffTime) {
      showAlert({
        type: "error",
        title: "Missing Date or Time",
        subtitle: "Please select both pickup and dropoff date and time before proceeding.",
      });
      return;
    }

    const data = {
      token: User?.idToken + "",
      carId: carId,
      clientId: UserId,
      pickupDateTime: `${dates.pickupDate.toISOString().split("T")[0]} ${dates.pickupTime}`,
      dropOffDateTime: `${dates.dropoffDate.toISOString().split("T")[0]} ${dates.dropoffTime}`,
      pickupLocationId: location.pickupLocationId,
      dropOffLocationId: location.dropoffLocationId
    };

    try {
      await dispatch(confirmReservation(data));
    } catch (err) {
      console.log(err)
    }
  };

  const [ThrottledHandleConfirmReservation] = useThrottledCallback(() => {
    HandleConfirmReservation();
  }, 4000);

  useEffect(() => {
    if (error) {
      console.log(error)
      if(error === "This car is already booked during the selected time period." ||
        error === "Selected pickup or dropoff location is not available for this car" ||
        error === "Missing required booking fields"
      ){
        setIsNotAvailable(true);
      }else{
        showAlert({
          type: "error",
          title: "Could not complete booking",
          subtitle: `${error}`,
        });
      }
    };

    if (success) {
      const pickup = dates.pickupDate!;
      const dropoff = dates.dropoffDate!;

      const formatBookingDate = (date: Date) =>
        date.toLocaleString("en-US", { month: "short", day: "numeric" });

      const formatChangeDeadline = (date: Date) =>
        date.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true }) +
        " " +
        date.toLocaleString("en-GB", { day: "2-digit", month: "short" });

      const formatOrderDate = (date: Date) =>
        date.toLocaleDateString("de-DE").replace(/\//g, ".");

      const changeDeadline = new Date();
      changeDeadline.setHours(changeDeadline.getHours() + 12);

      const carName = carDetails?.model ?? "Car";
      const pickupFormatted = formatBookingDate(pickup);
      const dropoffFormatted = formatBookingDate(dropoff);
      const changeDeadlineFormatted = formatChangeDeadline(changeDeadline);
      const orderDateFormatted = formatOrderDate(changeDeadline);

      showAlert({
        type: "success",
        title: "Congratulations!",
        subtitle: `${carName} is booked for ${pickupFormatted} - ${dropoffFormatted}\nYou can change booking details until ${changeDeadlineFormatted}.\nYour order: #${bookingStatus.orderId} (${orderDateFormatted})`,
      });
      dispatch(fetchNotifications(UserIdToken));
      dispatch(resetBookingStatus());
      nav("/my-bookings");
    }
  }, [error, success, dispatch, nav, carDetails, bookingStatus.orderId, dates]);

  let totalDays = 1;
  if (dates.pickupDate && dates.dropoffDate) {
    const timeDiff = dates.dropoffDate.getTime() - dates.pickupDate.getTime();
    totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;
  }

  const totalPrice = carDetails?.pricePerDay ? carDetails.pricePerDay * totalDays : "N/A";

  const fallbackCarData = {
    CarId: carId ?? "",
    CarName: carDetails?.model ?? "Loading...",
    CarImage: carDetails?.images ? carDetails.images[0] : carDetails?.imageUrl,
    Location: carDetails?.location ?? "",
    TotalPrice: totalPrice,
    DipositAmt: "2000",
  };

  return (
    <>
      <div className="pl-9 text-sm text-black inline-flex items-center space-x-1">
        <span className="text-gray-400 font-semibold cursor-pointer" onClick={() => nav("/cars")}>Cars</span>
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.4409 9.17597C10.4966 9.12019 10.5628 9.07593 10.6356 9.04574C10.7084 9.01554 10.7865 9 10.8654 9C10.9442 9 11.0223 9.01554 11.0951 9.04574C11.168 9.07593 11.2341 9.12019 11.2899 9.17597L13.6899 11.576C13.8022 11.6885 13.8653 11.841 13.8653 12C13.8653 12.159 13.8022 12.3115 13.6899 12.424L11.2899 14.824C11.2342 14.8798 11.1681 14.9241 11.0953 14.9543C11.0225 14.9846 10.9444 15.0002 10.8656 15.0003C10.7867 15.0004 10.7086 14.985 10.6358 14.9549C10.5629 14.9248 10.4967 14.8807 10.4409 14.825C10.385 14.7693 10.3408 14.7032 10.3105 14.6304C10.2802 14.5576 10.2646 14.4795 10.2645 14.4007C10.2644 14.3218 10.2799 14.2438 10.31 14.1709C10.34 14.098 10.3842 14.0318 10.4399 13.976L12.4179 12L10.4419 10.024C10.3295 9.91147 10.2664 9.75897 10.2664 9.59997C10.2664 9.44097 10.3285 9.28847 10.4409 9.17597Z" fill="black" />
        </svg>

        <span className="text-black font-semibold cursor-pointer">Car Booking</span>
      </div>

      <div className="min-h-screen p-2 text-black">
        <h1 className="text-5xl font-bold mb-8 ml-6 mt-5">Car booking</h1>
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-5">
          <div className="flex flex-col pt-6 pl-6 p-4 w-full md:w-[32%]">
            {UserId && <PersonalInfo info={personalInfo} />}
            <Location location={location} setLocation={setLocation} locations={locations} allowedLocationIds={carDetails?.locationIds ?? []} />
            <DateTime dates={dates} setDate={setDates} carId={carId} mode="booking"/>
          </div>
          <div className="w-full p-5 md:p-0 md:w-[50%] md:mt-16 mx-auto">
            <CarDetails
              carData={fallbackCarData}
              role="booking"
              func={ThrottledHandleConfirmReservation}
              isDisabled={IsNotAvailable || !UserId}
              isLoading = {bookingStatus.loading}
            />
          </div>
        </div>
      </div>

      <CarAlreadyReserved isOpen={IsNotAvailable} onClose={() => nav("/my-bookings")} />
    </>
  );
};

export default CarBooking;
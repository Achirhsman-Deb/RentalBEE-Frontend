import React, { useEffect, useState } from "react";
import CarImageViewer from "../Components/Cars/CarImageViewer";
import CarDetailsCard from "../Components/Cars/CarDetailsCard";
import FeedbackList from "../Components/Cars/FeedbackList";
import { EndPoint } from "../utils";
import { fetchBookedDates } from "../slices/ThunkAPI/ThunkAPI";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useAlert } from "../Components/AlertProvider";
import LazyCarDetailLoader from "../Components/Cars/LazyCarDetailSkeleton";

interface Feature {
  icon: string;
  label: string;
}

interface Car {
  carId: string;
  carRating: string;
  imageUrl: string;
  location: string;
  model: string;
  pricePerDay: string;
  serviceRating: string;
  status: string;
  features?: Feature[];
}

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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, car }) => {
  const myalert = useAlert();

  const dispatch = useDispatch<AppDispatch>();

  const [carDetails, setCarDetails] = useState<CarDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const bookedDates = useSelector((state: RootState) => state.cars.bookedDates);
  const datesloading = useSelector((state: RootState) => state.cars.loading);

  const { error: feedbackError } = useSelector(
    (state: RootState) => state.feedback
  );

  const { error: BookedDatesError } = useSelector(
    (state: RootState) => state.cars
  );

  const [handledError, setHandledError] = useState<boolean>(false);

  useEffect(() => {
    if (car?.carId) {
      setLoading(true);
      fetch(`${EndPoint}/cars/${car.carId}`)
        .then((response) => response.json())
        .then((data) => {
          setCarDetails(data);
          setLoading(false);
        })
        .catch((error) => {
          if (!handledError) {
            myalert({
              type: "error",
              title: "Error!",
              subtitle: error?.message + " Please try after some time.",
            });
            onClose();
            setHandledError(true);
          }
          setLoading(false);
        });
    }
  }, [car?.carId, handledError, myalert, onClose]);

  useEffect(() => {
    if (car?.carId) {
      dispatch(fetchBookedDates(car.carId));
    }
  }, [dispatch, car?.carId]);

  useEffect(() => {
    if (!handledError) {
      if (feedbackError) {
        myalert({
          type: "error",
          title: "Error!",
          subtitle:
            feedbackError + " Something went wrong. Please try after some time.",
        });
        onClose();
        setHandledError(true);
      } else if (BookedDatesError) {
        myalert({
          type: "error",
          title: "Error!",
          subtitle:
            BookedDatesError +
            " Something went wrong. Please try after some time.",
        });
        onClose();
        setHandledError(true);
      }
    }
  }, [feedbackError, BookedDatesError, handledError, myalert, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose();
  };

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
          onClick={handleClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {loading || datesloading ? (
          <LazyCarDetailLoader size={1} />
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-5 items-start w-full">
              <CarImageViewer
                images={carDetails?.images || []}
                className="w-full lg:w-[60%]"
              />
              <CarDetailsCard
                car={{
                  name: carDetails?.model || "",
                  carId: carDetails?.carId || "",
                  location: car?.location || "",
                  carRating: carDetails?.carRating.toString() || "",
                  price: carDetails?.pricePerDay || 0,
                  gearBoxType: carDetails?.gearBoxType || "-",
                  fuelType: carDetails?.fuelType || "-",
                  fuelConsumption: carDetails?.fuelConsumption || "-",
                  climateControlOption: carDetails?.climateControlOption || "-",
                  engineCapacity: carDetails?.engineCapacity || "-",
                  passengerCapacity: carDetails?.passengerCapacity || "-",
                }}
                bookeddates={bookedDates}
                className="w-full"
              />
            </div>
            <div className="mt-6 sm:mt-8 w-full">
              <FeedbackList carId={car?.carId || "-"} />
            </div>
          </>
        )}
      </div>
    </div>

  );
};

export default Modal;
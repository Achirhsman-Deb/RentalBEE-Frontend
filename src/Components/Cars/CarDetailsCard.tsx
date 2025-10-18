import React, { useEffect, useState } from "react";
import Button from "../Button";
import DateRangeSelector from "./DateRangeSelector";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAlert } from "../AlertProvider";
import { RootState } from "../../store/store";
import { AirVent, Armchair, Cog, Fuel, ReceiptIndianRupee, TruckElectric } from "lucide-react";

type CarStatus =
  | "reserved"
  | "reservedBySA"
  | "serviceStarted"
  | "serviceProvided"
  | "serviceFinished"
  | "canceled";

interface Car {
  name: string;
  location?: string;
  price?: number;
  carId: string;
  carRating: string | number;
  gearBoxType: string;
  fuelType: string;
  fuelConsumption: string;
  climateControlOption: string;
  engineCapacity: string;
  passengerCapacity: string;
  LocationDetails?: {
    pickupLocationName?: string,
    dropoffLocationName?: string,
    pickupLocationUrl?: string,
    dropoffLocationUrl?: string
  };
  status?: CarStatus;
}

type SelectedDate = {
  pickupDate: Date | null;
  dropoffDate: Date | null;
  pickupTime: string | null;
  dropoffTime: string | null;
};

interface CarDetailsCardProps {
  car: Car;
  bookeddates?: string[];
  className?: string;
  showBookingOptions?: boolean;
}

const statusLabels: Record<CarStatus, { label: string; color: string }> = {
  reserved: { label: 'Reserved', color: 'text-green' },
  reservedBySA: { label: 'Reserved by SA', color: 'text-green' },
  serviceStarted: { label: 'Service started', color: 'text-[#1279C2]' },
  serviceProvided: { label: 'Service provided', color: 'text-black' },
  serviceFinished: { label: 'Booking finished', color: 'text-[#E09811]' },
  canceled: { label: 'Canceled', color: 'text-[#E22D0D]' },
};

const CarDetailsCard: React.FC<CarDetailsCardProps> = ({
  car,
  bookeddates = [],
  className,
  showBookingOptions = true,
}) => {
  const [dates, setDates] = useState<SelectedDate>({
    pickupDate: null,
    dropoffDate: null,
    pickupTime: null,
    dropoffTime: null,
  });
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const myAlert = useAlert();
  console.log(car.LocationDetails)

  useEffect(() => {
    setLoggedIn(!!user);
  }, [user]);

  return (
    <div
      className={`${className} flex-1 flex flex-col justify-between p-4 h-auto bg-[#F0F0F0] rounded-lg min-w-0`}
    >
      <div className="mb-4 flex justify-between">
        <div>
          <h2 className="text-2xl">{car.name}</h2>
          {car.location && <p className="text-gray-500">{car.location}</p>}
          {car.status && (
            <div className="text-gray-500 text-xs flex flex-row items-center gap-2">
              Status:
              <div className={`${statusLabels[car.status]?.color || "text-black"}`}>
                {statusLabels[car.status]?.label || car.status}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">{car.carRating}</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            xmlns="http://www.w3.org/2000/svg"
            className="w-2.5 h-2.5"
          >
            <path
              d="M4.04895 0.926638C4.34833 0.00537562 5.65167 0.0053761 5.95105 0.926639L6.34722 2.14577C6.4811 2.55776 6.86502 2.8367 7.29822 2.83672L8.58011 2.83676C9.5488 2.8368 9.95155 4.07635 9.16789 4.64576L8.13085 5.39927C7.78039 5.65391 7.63375 6.10525 7.7676 6.51725L8.16367 7.73641C8.46298 8.65769 7.40855 9.42378 6.62485 8.85443L5.58775 8.10099C5.23728 7.84638 4.76272 7.84638 4.41225 8.10099L3.37515 8.85443C2.59144 9.42378 1.53702 8.65769 1.83633 7.73641L2.23241 6.51725C2.36626 6.10525 2.21961 5.65391 1.86915 5.39927L0.832114 4.64576C0.0484526 4.07635 0.451207 2.8368 1.41989 2.83676L2.70178 2.83672C3.13498 2.8367 3.5189 2.55776 3.65278 2.14577L4.04895 0.926638Z"
              fill="#F8B334"
            />
          </svg>
        </div>
      </div>

      <hr className="border-t border-gray-300 mb-4" />

      {/* Features grid */}
      <div className="grid grid-cols-2 gap-2 justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm flex flex-row items-center gap-x-2"><Cog size={15}/>{car.gearBoxType}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm flex flex-row items-center gap-x-2"><Fuel size={15}/>{car.engineCapacity}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm flex flex-row items-center gap-x-2">{car.fuelType == "DIESEL" ? <Fuel size={15}/>:<TruckElectric size={15}/>}{car.fuelType}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm flex flex-row items-center gap-x-2"><Armchair size={15}/>{car.passengerCapacity} seats</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm flex flex-row items-center gap-x-2"><ReceiptIndianRupee size={15}/>{car.fuelConsumption}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm flex flex-row items-center gap-x-2"><AirVent size={15}/>{car.climateControlOption}</p>
        </div>
      </div>

      {/* Only show booking features if enabled */}
      {showBookingOptions && (
        <>
          <DateRangeSelector
            date={dates}
            setDate={setDates}
            bookeddates={bookeddates}
          />
          <div className="mt-5">
            <Button
              type="filled"
              onClick={() => {
                if (loggedIn) {
                  if (
                    !dates.pickupDate ||
                    !dates.pickupTime ||
                    !dates.dropoffDate ||
                    !dates.dropoffTime
                  ) {
                    myAlert({
                      type: "error",
                      title: "Please select the Booking-date",
                      subtitle:
                        "To continue booking a car, you need to select the booking date & time",
                    });
                  } else {
                    navigate(
                      `/cars/car-booking/${car.carId}?pickupDate=${dates.pickupDate}&pickupTime=${dates.pickupTime}&dropoffDate=${dates.dropoffDate}&dropoffTime=${dates.dropoffTime}`
                    );
                  }
                } else {
                  myAlert({
                    type: "error",
                    title: "You are not logged in!",
                    subtitle:
                      "To continue booking a car, you need to log in or create an account",
                    buttons: [
                      <Button type={"outline"} onClick={() => { }}>
                        Cancel
                      </Button>,
                      <Button
                        type={"filled"}
                        onClick={() => navigate("/login")}
                      >
                        Log in
                      </Button>,
                    ],
                  });
                }
              }}
            >
              Book the car - ₹{car.price}/day
            </Button>
          </div>
        </>
      )}
      

      {user?.role === "CLIENT" && !showBookingOptions && car.LocationDetails && (
        <div>
          <hr className="border-t border-gray-300 mb-4 mt-4 w-full" />
          <div className="flex flex-row items-center justify-around w-full">
            <div className="flex flex-col w-[46%]">
              <p className="text-xs mb-1">Pickup Location</p>
              <div className="bg-white p-2 rounded-lg">
                {car.LocationDetails.pickupLocationUrl ? (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      car.LocationDetails.pickupLocationUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {car.LocationDetails.pickupLocationName}
                  </a>
                ) : (
                  car.LocationDetails.pickupLocationName
                )}
              </div>
            </div>
            <div className="flex flex-col w-[46%]">
              <p className="text-xs mb-1">Dropoff Location</p>
              <div className="bg-white p-2 rounded-lg">
                {car.LocationDetails.dropoffLocationUrl ? (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      car.LocationDetails.dropoffLocationUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {car.LocationDetails.dropoffLocationName}
                  </a>
                ) : (
                  car.LocationDetails.dropoffLocationName
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailsCard;

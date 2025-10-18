import React, { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import Button from "../Components/Button";
import Modal from "./Modal";
import OrderSummeryPrices from "../Components/MyBookings/OrderSummeryPrices";
import { useAlert } from "../Components/AlertProvider";
import { EndPoint } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchSupportBookingById } from "../slices/ThunkAPI/ThunkAPI";
import axios from "axios";

interface BookingDetailsProps {
  bookingDetails: DetailedBooking | null;
  onClose: () => void;
  onStatusUpdate?: (updatedBooking: DetailedBooking) => void;
  onLoading: boolean
}

interface DetailedBooking {
  _id: string;
  bookingDate: string;
  status: string;
  createdAt: string;
  carId: {
    _id: string;
    model: string;
    images: string[];
    category: string;
    engineCapacity: string;
    fuelType: string;
    gearBoxType: string;
    passengerCapacity: number;
    carRating: any;
    pricePerDay: string;
  };
  clientId: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
  pickupDateTime: string;
  dropoffDateTime: string;
  pickupLocationId: {
    locationName: string;
    locationAddress: string;
  };
  dropoffLocationId: {
    locationName: string;
    locationAddress: string;
  };
}

interface CarDetails {
  carId: string;
  carRating: string;
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
  pricePerDay: string;
  serviceRating: string;
  status: string;
  imageUrl: string;
}

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse flex flex-col gap-4">
    <div className="bg-gray-200 h-[200px] rounded-lg" />
    <div className="flex flex-row gap-3">
      <div className="bg-gray-200 h-6 w-1/3 rounded" />
      <div className="bg-gray-200 h-6 w-1/4 rounded" />
    </div>
    <div className="bg-gray-200 h-[100px] rounded-lg" />
  </div>
);

const UserBookingDetailsModal: React.FC<BookingDetailsProps> = ({
  bookingDetails,
  onClose,
  onStatusUpdate,
  onLoading
}) => {
  const [viewModelOpen, setViewModelOpen] = useState(false);
  const [days, setDays] = useState<number>(0);
  const [updating, setUpdating] = useState(false);
  const myalert = useAlert();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (bookingDetails?.pickupDateTime && bookingDetails?.dropoffDateTime) {
      const pickup = new Date(bookingDetails.pickupDateTime);
      const dropoff = new Date(bookingDetails.dropoffDateTime);
      const calculatedDays = Math.ceil(
        (dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)
      );
      setDays(calculatedDays);
    }
  }, [bookingDetails]);

  if (!bookingDetails || onLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-[75] p-2 sm:p-4">
        <div className="bg-white rounded-lg shadow-xl w-[1000px] max-w-[95%] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl text-center font-semibold mb-4 text-gray-800">
            Loading Booking Details...
          </h2>
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  const carData: CarDetails = {
    carId: bookingDetails.carId._id,
    carRating: bookingDetails.carId.carRating || "0",
    climateControlOption: "",
    engineCapacity: bookingDetails.carId.engineCapacity,
    fuelConsumption: "",
    fuelType: bookingDetails.carId.fuelType,
    gearBoxType: bookingDetails.carId.gearBoxType,
    images: bookingDetails.carId.images,
    imageUrl: bookingDetails.carId.images[0] || "",
    location: bookingDetails.pickupLocationId.locationName,
    locationIds: [],
    model: bookingDetails.carId.model,
    passengerCapacity: bookingDetails.carId.passengerCapacity.toString(),
    pricePerDay: bookingDetails.carId.pricePerDay,
    serviceRating: "",
    status: bookingDetails.status,
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "BOOKED":
        return "text-blue-600 bg-blue-100";
      case "RESERVED":
        return "text-yellow-600 bg-yellow-100";
      case "SERVICESTARTED":
        return "text-purple-600 bg-purple-100";
      case "SERVICEPROVIDED":
        return "text-green-600 bg-green-100";
      case "CANCELED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getMapLink = (address: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;

  const getActionButtons = () => {
    switch (bookingDetails.status) {
      case "BOOKED":
        return [
          { label: "Cancel Booking", status: "CANCELED", type: "outline" },
          { label: "Reserve Vehicle", status: "RESERVED", type: "filled" },
        ];
      case "RESERVED":
        return [{ label: "Start Service", status: "SERVICESTARTED", type: "filled" }];
      case "SERVICESTARTED":
        return [{ label: "Mark as Completed", status: "SERVICEPROVIDED", type: "filled" }];
      default:
        return [];
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdating(true);
      const { data } = await axios.post(
        `${EndPoint}/support/reservations/${bookingDetails._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${user?.idToken}`,
          },
        }
      );

      setUpdating(false);

      dispatch(
        fetchSupportBookingById({
          id: bookingDetails._id,
          token: user?.idToken,
        })
      );

      myalert({
        type: "success",
        title: "Success!",
        subtitle: "Booking status updated successfully.",
      });

      if (onStatusUpdate && data.booking) {
        onStatusUpdate(data.booking);
      }
    } catch (error: any) {
      setUpdating(false);
      myalert({
        type: "error",
        title: "Error!",
        subtitle: error.message || "Something went wrong.",
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-[75] p-2 sm:p-4">
        <div className="bg-white rounded-lg shadow-xl w-[1000px] max-w-[95%] p-6 relative overflow-y-auto max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl text-center font-semibold mb-4 text-gray-800">
            Booking Details
          </h2>

          <div className="flex flex-col gap-6">
            {/* Car Section */}
            <div className="bg-transparent border-2 w-full flex flex-col md:flex-row rounded-lg p-2 gap-x-3 items-center">
              <div className="flex md:h-[15vh] border rounded-md">
                <img src={bookingDetails.carId.images[0]} className="rounded-md" alt={bookingDetails.carId.model} />
              </div>
              <div className="flex flex-col py-2 gap-y-2">
                <p className="text-black text-2xl"> {bookingDetails.carId.model} </p>
                <Button type="filled" onClick={() => setViewModelOpen(true)}> Show Model </Button>
              </div>
            </div>

            {/* Order Summary + Details */}
            <div className="flex flex-col sm:flex-row gap-6">
              <OrderSummeryPrices
                days={days}
                pricePerDay={Number(bookingDetails.carId.pricePerDay) || 0}
              />

              <div className="flex-1 flex flex-col gap-y-4 text-sm text-gray-700 border-2 rounded-lg p-3">
                <div>
                  <h3 className="font-semibold text-base mb-1 text-gray-900">
                    Status:
                    <span
                      className={`ml-2 px-2 py-1 rounded-md text-sm font-medium ${getStatusColor(
                        bookingDetails.status
                      )}`}
                    >
                      {bookingDetails.status}
                    </span>
                  </h3>

                  <h3 className="font-semibold text-base mb-1 text-gray-900">
                    Locations
                  </h3>
                  <p className="flex flex-row gap-x-2">
                    <span className="font-medium">Pickup:</span>{" "}
                    <a
                      href={getMapLink(
                        bookingDetails.pickupLocationId.locationAddress
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 underline font-semibold hover:text-black flex flex-row gap-x-1 items-center"
                    >
                      {bookingDetails.pickupLocationId.locationName}
                      <ExternalLink size={15}/>
                    </a>
                  </p>
                  <p className="flex flex-row gap-x-2">
                    <span className="font-medium">Dropoff:</span>{" "}
                    <a
                      href={getMapLink(
                        bookingDetails.dropoffLocationId.locationAddress
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 underline font-semibold hover:text-black flex flex-row gap-x-1 items-center"
                    >
                      {bookingDetails.dropoffLocationId.locationName}
                      <ExternalLink size={15}/>
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-1 text-gray-900">
                    Booking Duration
                  </h3>
                  <p>
                    <span className="font-medium">Pickup:</span>{" "}
                    {formatDate(bookingDetails.pickupDateTime)}
                  </p>
                  <p>
                    <span className="font-medium">Dropoff:</span>{" "}
                    {formatDate(bookingDetails.dropoffDateTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {getActionButtons().length > 0 && (
              <div className="flex flex-col md:flex-row gap-3 justify-end mt-2">
                {getActionButtons().map((btn) => (
                  <Button
                    key={btn.status}
                    type={btn.type as "filled" | "outline"}
                    onClick={() => handleStatusChange(btn.status)}
                    disabled={updating}
                  >
                    {updating ? "Updating..." : btn.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Car Details Modal */}
      {viewModelOpen && (
        <Modal
          isOpen={viewModelOpen}
          onClose={() => setViewModelOpen(false)}
          car={carData}
        />
      )}
    </>
  );
};

export default UserBookingDetailsModal;
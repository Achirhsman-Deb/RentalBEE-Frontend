import React from "react";
import { X } from "lucide-react";

interface BookingDetailsProps {
  bookingDetails: any
  onClose: () => void;
}

const UserBookingDetailsModal: React.FC<BookingDetailsProps> = ({
  bookingDetails,
  onClose,
}) => {

//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     return date.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-[75] p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-[700px] max-w-[95%] p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Booking Details
        </h2>
        <p>{bookingDetails._id}</p>
        
        
      </div>
    </div>
  );
};

export default UserBookingDetailsModal;
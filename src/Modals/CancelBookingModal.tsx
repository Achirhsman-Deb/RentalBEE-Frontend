import React from 'react'
import Button from '../Components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { cancelBooking } from '../slices/ThunkAPI/ThunkAPI';
import { useAlert } from '../Components/AlertProvider';

interface PropType {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  getBookingFunc: () => void;
}

const CancelBookingModal: React.FC<PropType> = ({ isOpen, onClose, bookingId, getBookingFunc }) => {
  const dispatch = useDispatch<AppDispatch>();
  const showAlert = useAlert();
  const User = useSelector((state: RootState) => state.auth.user);
  const { cancelLoading } = useSelector((state: RootState) => state.booking);


  const handleSubmit = async () => {
    if (!User?.userId || !User?.idToken) {
      showAlert({
        type: "error",
        title: "User Info Missing",
        subtitle: "Please wait for the user to load or re-login.",
      });
      return;
    }

    const data = {
      bookingId,
      userId: User.userId,
      token: User.idToken,
    };

    try {
      const response = await dispatch(cancelBooking(data)).unwrap();

      if (response.immediateCancel) {
        showAlert({
          type: "success",
          title: "Booking Cancelled",
          subtitle: response.message || "Your booking has been cancelled successfully.",
        });
      } else if (response.requestSubmitted) {
        showAlert({
          type: "success",
          title: "Cancellation Request Sent",
          subtitle: response.message || "Your cancellation request has been sent for review.",
        });
      } else {
        showAlert({
          type: "success",
          title: "Action Completed",
          subtitle: response.message || "Cancellation processed successfully.",
        });
      }

      onClose();
      setTimeout(() => getBookingFunc(), 1000);
    } catch (error: any) {
      showAlert({
        type: "error",
        title: "Cancellation Failed",
        subtitle: error || "Failed to cancel booking. Please try again later.",
      });
      onClose();
    }
  };


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#F0F0F0] rounded-md p-5 sm:p-6 w-full max-w-md shadow-lg flex flex-col gap-y-5">
        <h2 className="text-2xl sm:text-3xl font-semibold">Cancel Booking?</h2>

        <p className="text-sm sm:text-base text-gray-500">
          You are about to cancel your booking. Are you sure you want to proceed?
        </p>

        <div className="flex flex-col sm:flex-row gap-y-3 sm:gap-y-0 sm:gap-x-4">

          <Button type='outline' onClick={handleSubmit} disabled={cancelLoading}>
            {cancelLoading ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
          <Button type='filled' onClick={onClose}>
            Resume Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;

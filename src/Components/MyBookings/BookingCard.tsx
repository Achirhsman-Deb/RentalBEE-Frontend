import React, { useState } from 'react';
import { Booking } from '../../types/BookingTypes';
import FeedBackModal from '../../Modals/FeedBackModal';
import CancelBookingModal from '../../Modals/CancelBookingModal';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';

interface Props {
  booking: Booking;
  getBookingsFunc: () => void;
  OrderSummeryOpen: () => void;
}

const carDefaultImage = 'https://www.buycarsonline.in/Images/default_car.jpg'

const statusLabels: Record<Booking['status'], { label: string; color: string }> = {
  booked: { label: 'Booked', color: 'bg-white text-lime-200' },
  reserved: { label: 'Reserved', color: 'bg-white text-green' },
  serviceStarted: { label: 'Service started', color: 'bg-white text-[#1279C2]' },
  serviceProvided: { label: 'Service provided', color: 'bg-white text-black' },
  serviceFinished: { label: 'Booking finished', color: 'bg-white text-[#E09811]' },
  canceled: { label: 'Canceled', color: 'bg-white text-[#E22D0D]' },
};

const BookingCard: React.FC<Props> = ({ booking, getBookingsFunc, OrderSummeryOpen }) => {
  const status = statusLabels[booking.status] || { label: booking.status, color: 'bg-white text-gray-500' };
  const nav = useNavigate();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const HandleFeedbackClose = () => {
    setIsFeedbackOpen(false);
    setTimeout(() => {
      getBookingsFunc();
    }, 1000);
  }

  const FeedBackData = {
    CarId: booking.carId,
    BokkingId: booking.id,
    CarName: booking.carName
  }

  const renderFeedbackButton = () => {
    if (booking.status === 'serviceProvided') {
      return (
        <div className='mt-3'>
          <Button onClick={() => setIsFeedbackOpen(true)} type='filled'>
            Leave feedback
          </Button>
        </div>
      );
    } else if (booking.status === 'serviceFinished') {
      return (
        <div className='mt-3'>
          <Button type='outline'>
            View feedback
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-100 rounded-xl p-4 w-full max-w-sm sm:max-w-xs md:max-w-sm lg:max-w-md shadow-sm relative">
      <div className="absolute top-5 left-5">
        <span className={`text-xs px-2 py-1 rounded ${status.color}`}>{status.label}</span>
      </div>
      <div className='cursor-default'>
        <img
          src={booking.carImage || carDefaultImage}
          alt={booking.carName}
          className="rounded-md w-full h-[140px] object-cover mb-2"
          onError={(e) => {
            (e.target as HTMLImageElement).src = carDefaultImage;
          }}
        />

        <h3 className="font-semibold text-base sm:text-sm">{booking.carName}</h3>
        <p className="text-sm sm:text-xs text-gray-500 cursor-text">
          Order: {booking.orderId} ({booking.date})
        </p>
      </div>

      {renderFeedbackButton()}

      {booking.status == 'reserved' || booking.status == 'booked' && (
        <div className="flex flex-wrap gap-2 mt-3">
          <div className='flex-1'>
            <Button type='outline' onClick={() => setIsCancelOpen(true)}>
              Cancel
            </Button>
          </div>
          <div className='flex-1'>
            <Button type='filled' onClick={() => { nav(`./edit-booking/${booking.id}`) }}>
              Edit
            </Button>
          </div>
        </div>
      )}


      {/* Feedback Modal */}
      <FeedBackModal isOpen={isFeedbackOpen} onClose={HandleFeedbackClose} Data={FeedBackData} />
      {/* cancelBooking */}
      <CancelBookingModal isOpen={isCancelOpen} onClose={() => setIsCancelOpen(false)} bookingId={booking.id} getBookingFunc={getBookingsFunc} />

      {booking.status != 'canceled' &&
        <Button
          type="underline"
          onClick={OrderSummeryOpen}
        >
          See more details
        </Button>
      }

      {booking.status == 'canceled' &&
        <p className="text-xs text-gray-500 mt-4">
          Have any questions?{' '}
          <span className="underline font-medium cursor-pointer">Support chat 💬</span>
        </p>
      }
    </div>
  );
};

export default BookingCard;
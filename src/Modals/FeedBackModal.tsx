import React, { useState } from 'react';
import Button from '../Components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../store/store";
import { postFeedback } from '../slices/ThunkAPI/ThunkAPI'; 
import type { AppDispatch } from '../store/store';

interface PropType {
  isOpen: boolean;
  onClose: () => void;
  Data: {
    CarId: string,
    BokkingId: string,
    CarName: string
  };
}

const FeedBackModal: React.FC<PropType> = ({ isOpen, onClose, Data }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState('');
  const User = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const UserId = useSelector((state: RootState) => state.auth.user?.userId);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!UserId) return;

    const data = {
      bookingId: Data.BokkingId,
      carId: Data.CarId,
      clientId: UserId,
      feedbackText: feedback,
      rating: rating.toString(),
      token: User?.idToken+""
    };

    dispatch(postFeedback(data));

    setRating(0);
    setFeedback('');
    onClose();
  };

  const renderStar = (starIndex: number) => {
    const isActive = (hovered || rating) >= starIndex;
    const fillColor = isActive ? '#FACC15' : '#DCDCDD';

    return (
      <svg
        key={starIndex}
        width="28"
        height="28"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="cursor-pointer transition-all"
        onMouseEnter={() => setHovered(starIndex)}
        onMouseLeave={() => setHovered(0)}
        onClick={() => setRating(starIndex)}
      >
        <path
          d="M9.04896 2.92664C9.34833 2.00537 10.6517 2.00538 10.951 2.92664L12.0208 6.21864C12.1547 6.63063 12.5386 6.90957 12.9718 6.90958L16.4333 6.90971C17.402 6.90975 17.8047 8.1493 17.0211 8.71871L14.2208 10.7534C13.8703 11.008 13.7237 11.4594 13.8575 11.8714L14.927 15.1635C15.2263 16.0847 14.1719 16.8508 13.3882 16.2815L10.5878 14.247C10.2373 13.9924 9.76272 13.9924 9.41225 14.247L6.61179 16.2815C5.82809 16.8508 4.77367 16.0847 5.07297 15.1635L6.14249 11.8714C6.27634 11.4594 6.1297 11.008 5.77924 10.7534L2.97894 8.71871C2.19528 8.1493 2.59804 6.90975 3.56672 6.90971L7.02818 6.90958C7.46137 6.90957 7.8453 6.63063 7.97918 6.21864L9.04896 2.92664Z"
          fill={fillColor}
        />
      </svg>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4 overflow-y-auto max-h-screen"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#F0F0F0] rounded-md p-6 md:p-8 w-full max-w-md shadow-lg mt-8 mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold">
          How was your experience?
        </h2>

        <h2 className="py-4 text-lg md:text-xl">{Data.CarName}</h2>

        <label className="text-sm text-gray-500">Rate your experience</label>
        <div className="flex gap-2 mb-4">{[1, 2, 3, 4, 5].map(renderStar)}</div>

        <label className="text-sm text-gray-500">Review</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none"
          rows={4}
          placeholder="Leave your comments here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <Button type='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button type='filled' onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedBackModal;

import React from "react";
import { Star } from "lucide-react";

interface FeedbackCardProps {
  data?: {
    id: string;
    carName: string;
    orderHistory: string;
    rating: number;
    review?: string;
    reviewer: string;
    location: string;
    date: string;
    image: string;
  };
  loading?: boolean;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="border border-gray-300 animate-pulse rounded-lg p-4 flex gap-4 shadow-sm h-48 w-full min-w-0">
        <div className="w-24 h-20 bg-gray-300 rounded-md flex-shrink-0" />
        <div className="flex flex-col justify-start flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="flex gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-300 rounded" />
            ))}
          </div>
          <div className="h-3 bg-gray-300 rounded w-full mt-2" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
          <div className="flex justify-between mt-3">
            <div className="h-3 bg-gray-300 rounded w-1/3" />
            <div className="h-3 bg-gray-300 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="border border-black overflow-hidden rounded-lg p-4 flex gap-4 shadow-sm h-48 w-full min-w-0">
      <img
        src={data.image}
        alt={data.carName}
        className="w-24 h-20 rounded-md object-cover flex-shrink-0"
      />
      <div className="flex flex-col justify-start flex-1">
        <h3 className="text-sm font-semibold text-gray-900">{data.carName}</h3>
        <p className="text-[11px] text-gray-500 mt-1">
          Order history: {data.orderHistory}
        </p>
        <div className="flex gap-[2px] text-yellow-500 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < Math.round(data.rating) ? "currentColor" : "none"}
              stroke="currentColor"
            />
          ))}
        </div>
        {data.review && (
          <p className="text-[13px] text-gray-800 mt-2 leading-snug line-clamp-2">
            "{data.review}"
          </p>
        )}
        <div className="flex items-center justify-between mt-3 text-[11px] text-gray-600">
          <p>
            <span className="font-semibold text-black">{data.reviewer}</span>,{" "}
            {data.location}
          </p>
          <p>{data.date}</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;

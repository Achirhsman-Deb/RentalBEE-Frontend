import React, { useEffect, useState } from "react";
import FeedbackCard from "./FeedbackCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ApiFeedback {
  author: string;
  carImageUrl: string;
  carModel: string;
  date: string;
  feedbackId: string;
  feedbackText: string;
  orderHistory: string;
  rating: string;
}

const Feedback: React.FC = () => {
  const [feedbackData, setFeedbackData] = useState<ApiFeedback[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [cardWidth, setCardWidth] = useState(360);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const loadFeedback = async () => {
      try {
          const response = await fetch(
            "http://localhost:5000/feedbacks/recent"
          );
          const data = await response.json();
          setFeedbackData(data);
      } catch (error) {
        console.error("Failed to load feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setVisibleCount(1);
        setCardWidth(width - 40);
      } else if (width < 1024) {
        setVisibleCount(2);
        setCardWidth((width - 60) / 2);
      } else {
        setVisibleCount(3);
        setCardWidth((width - 80) / 3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, feedbackData.length - visibleCount);
  const handleNext = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="bg-[#fffbf3] px-4 md:px-6 pt-16 font-sans mt-6 overflow-hidden">
      <h2 className="text-xl text-gray-600 mb-6">(RECENT FEEDBACK)</h2>

      <div className="relative w-full overflow-x-hidden">
        <div className="flex transition-transform duration-500 ease-in-out w-full">
          {(loading ? Array.from({ length: visibleCount }) : feedbackData.slice(currentIndex, currentIndex + visibleCount)).map(
            (item, index) => {
              const feedbackItem = item as ApiFeedback;
              return (
                <div
                  key={loading ? index : feedbackItem.feedbackId}
                  style={{ width: `${cardWidth}px` }}
                  className="p-2 box-border"
                >
                  <FeedbackCard
                    loading={loading}
                    data={
                      loading
                        ? undefined
                        : {
                            id: feedbackItem.feedbackId,
                            carName: feedbackItem.carModel,
                            orderHistory: feedbackItem.orderHistory,
                            rating: parseFloat(feedbackItem.rating),
                            review: feedbackItem.feedbackText,
                            reviewer: feedbackItem.author.split(",")[0],
                            location:
                              feedbackItem.author.split(",")[1]?.trim() || "Unknown",
                            date: feedbackItem.date,
                            image: feedbackItem.carImageUrl,
                          }
                    }
                  />
                </div>
              );
            }
          )}
        </div>
      </div>

      <div className="flex justify-center md:justify-end mt-6 gap-2">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-200"
          disabled={currentIndex === 0 || loading}
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-200"
          disabled={currentIndex === maxIndex || loading}
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Feedback;

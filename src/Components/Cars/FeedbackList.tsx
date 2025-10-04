import React, { useEffect, useState } from "react";
import Pagination from "../Pagination";
import DropDown from "../Inputs/DropDown";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchClientReviews } from "../../slices/ThunkAPI/ThunkAPI";
import defaultProfile from '../../assets/default_profile.jpg'


interface FeedbackProps {
  carId: string;
}

const FeedbackList: React.FC<FeedbackProps> = ({ carId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { reviews, totalPages, loading, error } = useSelector(
    (state: RootState) => state.feedback
  );

  const [currPage, setCurrPage] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>("The newest");
  const itemsPerPage = 4;

  const reportTypes = [
    { value: "The newest", label: "Sort: The newest" },
    { value: "The latest", label: "Sort: The latest" },
    { value: "Rating: low to high", label: "Sort: Rating: low to high" },
    { value: "Rating: high to low", label: "Sort: Rating: high to low" },
  ];

  useEffect(() => {
    dispatch(
      fetchClientReviews({
        carId: carId,
        page: currPage,
        size: itemsPerPage,
        sort: "DATE",
        direction: "DESC",
      })
    );
  }, [dispatch, currPage, carId]);



  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortOption) {
      case "The newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "The latest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "Rating: low to high":
        return parseFloat(a.rentalExperience) - parseFloat(b.rentalExperience);
      case "Rating: high to low":
        return parseFloat(b.rentalExperience) - parseFloat(a.rentalExperience);
      default:
        return 0;
    }
  });

  const handleFilterChange = (field: string, value: any) => {
    console.log(field)
    setSortOption(value);
    setCurrPage(0);
    
  };

  return (
    <div className="bg-[#F0F0F0] mx-1 my-4 p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold">Feedback</h2>
        <div className="w-60">
          <DropDown
            label=""
            options={reportTypes}
            placeholder={sortOption || "Sort"}
            onchange={(value) =>
              handleFilterChange("sortOption", Array.isArray(value) ? value[0] : value)
            }
          />
        </div>
      </div>
      <hr className="border-t border-gray-300 mb-6" />
      {loading ? (
        <div className="text-center text-gray-500">Loading feedback...</div>
      ) : error ? (
        <div className="text-center text-red-500">
          {typeof error === 'string'
            ? error
            : (error as any)?.message || 'An unknown error occurred.'}
        </div>
      ) : (
        <div className="space-y-6">
          {sortedReviews.map((feedback, index) => (
            <div
              key={index}
              className="bg-[#F0F0F0] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <img
                  src={feedback.authorImageUrl || defaultProfile}
                  alt={feedback.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium text-sm">{feedback.author}</span>
              </div>
              <div className="flex flex-col w-full sm:w-2/3">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-2.5 h-2.5"
                    >
                      <path
                        d="M4.04895 0.926638C4.34833 0.00537562 5.65167 0.0053761 5.95105 0.926639L6.34722 2.14577C6.4811 2.55776 6.86502 2.8367 7.29822 2.83672L8.58011 2.83676C9.5488 2.8368 9.95155 4.07635 9.16789 4.64576L8.13085 5.39927C7.78039 5.65391 7.63375 6.10525 7.7676 6.51725L8.16367 7.73641C8.46298 8.65769 7.40855 9.42378 6.62485 8.85443L5.58775 8.10099C5.23728 7.84638 4.76272 7.84638 4.41225 8.10099L3.37515 8.85443C2.59144 9.42378 1.53702 8.65769 1.83633 7.73641L2.23241 6.51725C2.36626 6.10525 2.21961 5.65391 1.86915 5.39927L0.832114 4.64576C0.0484526 4.07635 0.451207 2.8368 1.41989 2.83676L2.70178 2.83672C3.13498 2.8367 3.5189 2.55776 3.65278 2.14577L4.04895 0.926638Z"
                        fill={i < parseInt(feedback.rentalExperience) ? "#F8B334" : "#F0F0F0"}
                        stroke="#F8B334"
                        strokeWidth="0.5"
                      />
                    </svg>
                  ))}
                </div>
                <p className="text-sm">{feedback.text}</p>
              </div>
              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                {feedback.date}
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="flex justify-center items-center mt-10 text-gray-medium text-xl font-semibold">
              <p>No Reviews Found!</p>
            </div>
          )}
          <div className="flex justify-center gap-2 pt-4">
            {reviews.length > 0 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currPage + 1}
                setCurrentPage={(page) => setCurrPage((page as number) - 1)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
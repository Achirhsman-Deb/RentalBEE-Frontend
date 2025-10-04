import React from "react";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({
    totalPages,
    currentPage,
    setCurrentPage,
}) => {
    return (

        <div className="flex justify-center gap-2 pt-4">
            <button
                type="button"
                aria-label="Previous page"
                onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50 hover:cursor-pointer"
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M25.3333 16.0013H6.66663M25.3333 16.0013L20 21.3346M25.3333 16.0013L20 10.668"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform="rotate(180 16 16)"

                    />
                </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 px-3 py-1 text-sm rounded-full hover:cursor-pointer ${currentPage === i + 1 ? "bg-black text-white" : "text-black"
                        }`}
                >
                    {i + 1}
                </button>
            ))}
            <button
                type="button"
                aria-label="Next page"
                onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50 hover:cursor-pointer"
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M25.3333 16.0013H6.66663M25.3333 16.0013L20 21.3346M25.3333 16.0013L20 10.668"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Pagination;

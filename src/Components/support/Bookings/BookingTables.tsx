import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface BookingRow {
    _id: string;
    bookingDate: string;
    status: string;
    totalPrice: number;
    createdAt: string;
    carId?: {
        model: string;
        category: string;
    };
    clientId?: {
        firstName: string;
        lastName: string;
    };
}

interface BookingsTableProps {
    data: BookingRow[];
    onViewDetails: (booking: string) => void;
}

const BookingsTable: React.FC<BookingsTableProps> = ({ data, onViewDetails }) => {
    const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);


    const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Format date
    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear()).slice(-2);
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${day}/${month}/${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
    };

    // Toggle dropdown
    const handleDropdownClick = (index: number) => {
        if (dropdownIndex === index) {
            setDropdownIndex(null);
            return;
        }

        const button = buttonRefs.current[index];
        if (button) {
            const rect = button.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX - 100,
            });
        }
        setDropdownIndex(index);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !buttonRefs.current.some((btn) => btn?.contains(event.target as Node))
            ) {
                setDropdownIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="overflow-x-auto max-w-full rounded-[8px] border border-gray-200">
            <table className="w-full text-gray-700 border-collapse min-w-[1000px] relative">
                <thead className="bg-black text-white text-[14px]">
                    <tr>
                        <th className="px-4 py-3 text-start">Client</th>
                        <th className="px-4 py-3 text-start">Car</th>
                        <th className="px-4 py-3 text-start">Booking Date</th>
                        <th className="px-4 py-3 text-start">Status</th>
                        <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((b, idx) => (
                        <tr key={b._id} className="hover:bg-gray-100 transition text-sm">
                            <td className="px-4 py-3 border-b">
                                {b.clientId ? `${b.clientId.firstName} ${b.clientId.lastName}` : "N/A"}
                            </td>
                            <td className="px-4 py-3 border-b">
                                {b.carId ? `${b.carId.model} (${b.carId.category})` : "N/A"}
                            </td>
                            <td className="px-4 py-3 border-b">{formatDateTime(b.createdAt)}</td>
                            <td className="px-4 py-3 border-b">{b.status}</td>
                            <td className="px-4 py-3 text-center border-b border-[#DCDCDD]">
                                <button
                                    ref={(el) => { buttonRefs.current[idx] = el }}
                                    onClick={() => handleDropdownClick(idx)}
                                >
                                    <svg
                                        className="h-4 w-4"
                                        width="25"
                                        height="24"
                                        viewBox="0 0 25 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M4.0647 12C4.0647 12.2652 4.17005 12.5196 4.35759 12.7071C4.54513 12.8946 4.79948 13 5.0647 13ZM11.0647 12C11.0647 12.2652 11.1701 12.5196 11.3576 12.7071C11.5451 12.8946 11.7995 13 12.0647 13ZM18.0647 12C18.0647 12.2652 18.1701 12.5196 18.3576 12.7071C18.5451 12.8946 18.7995 13 19.0647 13Z"
                                            stroke="#666666"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}

                    {dropdownIndex !== null &&
                        dropdownPosition &&
                        createPortal(
                            <div
                                ref={dropdownRef}
                                className="absolute z-50 bg-[#FFFBF3] border border-[#DCDCDD] rounded-[8px] shadow-md w-40"
                                style={{
                                    top: dropdownPosition.top,
                                    left: dropdownPosition.left,
                                    padding: "8px",
                                }}
                            >
                                <ul className="py-1 text-sm text-gray-800 flex flex-col gap-[1px]">
                                    <button
                                        className="px-4 py-2 hover:bg-black transition-all rounded-md cursor-pointer font-semibold hover:text-white text-[#666666]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewDetails(data[dropdownIndex]._id);
                                        }}
                                    >
                                        View details
                                    </button>
                                </ul>
                            </div>,
                            document.body
                        )}

                    {data.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-10 text-gray-500 font-medium">
                                No bookings found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BookingsTable;

import React, { useEffect, useState } from "react";

interface BookingFilterProps {
  status: "ALL" | "BOOKED" | "RESERVED" | "SERVICESTARTED" | "COMPLETED" | "CANCELED";
  setStatus: React.Dispatch<
    React.SetStateAction<"ALL" | "BOOKED" | "RESERVED" | "SERVICESTARTED" | "COMPLETED" | "CANCELED">
  >;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  onSearch: (query: string) => void;
  onCarFilter: (carId: string) => void;
  cars: { id: string; name: string }[];
}

const BookingFilter: React.FC<BookingFilterProps> = ({
  status,
  setStatus,
  pageSize,
  setPageSize,
  onSearch,
  onCarFilter,
  cars,
}) => {
  const options: BookingFilterProps["status"][] = [
    "ALL",
    "BOOKED",
    "RESERVED",
    "SERVICESTARTED",
    "COMPLETED",
    "CANCELED",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [selectedCar, setSelectedCar] = useState("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Trigger parent search when debounced term changes
  useEffect(() => {
    onSearch(debouncedSearch.trim());
  }, [debouncedSearch]);

  // Trigger car filter
  useEffect(() => {
    onCarFilter(selectedCar);
  }, [selectedCar]);

  return (
    <div className="w-full pb-4 md:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left side: Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <span className="font-medium text-gray-800">Filter by Status:</span>

        {/* Buttons (desktop) */}
        <div className="hidden md:flex gap-2 flex-wrap">
          {options.map((opt) => (
            <button
              key={opt}
              className={`px-4 py-1.5 rounded-2xl text-sm font-medium transition-all duration-200 shadow-sm ${
                status === opt
                  ? "bg-black text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setStatus(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Dropdown (mobile) */}
        <div className="flex md:hidden">
          <select
            className="border border-gray-300 rounded-2xl text-sm px-3 py-2 bg-white shadow-sm focus:ring-1 focus:ring-black outline-none transition-all w-full"
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as
                  | "ALL"
                  | "BOOKED"
                  | "RESERVED"
                  | "SERVICESTARTED"
                  | "COMPLETED"
                  | "CANCELED"
              )
            }
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right side: Search, Car dropdown, Page size */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
        {/* Search Bar */}
        <div className="relative w-full sm:w-60">
          <input
            type="text"
            placeholder="Search by client name..."
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-row gap-x-3">
          {/* Car Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-48">
            <select
              className="border border-gray-300 rounded-2xl text-sm px-3 py-2 bg-white shadow-sm focus:ring-1 focus:ring-black outline-none transition-all w-full"
              value={selectedCar}
              onChange={(e) => setSelectedCar(e.target.value)}
            >
              <option value="">All Cars</option>
              {cars.map((car) => (
                <option key={car.name} value={car.name}>
                  {car.name}
                </option>
              ))}
            </select>
          </div>

          {/* Page Size */}
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-gray-700 font-medium">Rows:</span>
            <select
              className="border border-gray-300 rounded-2xl text-sm px-2 py-2 bg-white shadow-sm focus:ring-1 focus:ring-black outline-none transition-all"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFilter;
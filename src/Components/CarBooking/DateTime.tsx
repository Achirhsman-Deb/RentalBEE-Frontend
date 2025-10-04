import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "../DatePicker";
import { fetchBookedDates } from "../../slices/ThunkAPI/ThunkAPI";
import { RootState, AppDispatch } from "../../store/store";

type SelectedDate = {
    pickupDate: Date | null;
    pickupTime: string | null;
    dropoffDate: Date | null;
    dropoffTime: string | null;
};

interface DateTimeProps {
    dates: SelectedDate; // Existing dates selected
    setDate: React.Dispatch<React.SetStateAction<SelectedDate>>; // State setter for dates
    carId: string | undefined; // ID of the car being booked/edited
    mode: "booking" | "editing"; // Mode: either booking or editing
    allowDates?: string[]; // Allowed dates to override booked dates during editing mode
}

const formatDateTime = (date: Date | null, time: string | null): string => {
    if (!date || !time) return "Not selected";
    const dateStr = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return `${dateStr} | ${time}`;
};

const DateTime: React.FC<DateTimeProps> = ({ dates, setDate, carId, mode, allowDates }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const bookedDates = useSelector((state: RootState) => state.cars.bookedDates); // All booked dates
    const loading = useSelector((state: RootState) => state.cars.loading);
    const error = useSelector((state: RootState) => state.cars.error);

    useEffect(() => {
        if (carId) {
            // Fetch booked dates only if carId is available
            dispatch(fetchBookedDates(carId));
        }
    }, [dispatch, carId]);

    // Calculate disabled dates: bookedDates minus allowDates during "editing"
    const disabledDates = React.useMemo(() => {
        if (mode === "editing" && allowDates) {
            // Exclude allowDates from bookedDates
            const allowDatesSet = new Set(allowDates); // Optimize lookup by converting to Set
            return bookedDates.filter((date) => !allowDatesSet.has(date));
        }

        // Default to bookedDates in booking mode
        return bookedDates;
    }, [mode, allowDates, bookedDates]);

    // Handle date change (coming from DatePicker)
    const handleDateChange = ({
        startDate,
        endDate,
        startTime,
        endTime,
    }: {
        startDate: string;
        endDate: string;
        startTime: string | null;
        endTime: string | null;
    }) => {
        const startdate = new Date(startDate);
        const enddate = new Date(endDate);

        setDate({
            pickupDate: startdate,
            pickupTime: startTime,
            dropoffDate: enddate,
            dropoffTime: endTime,
        });
    };

    return (
        <>
            <h2 className="text-2xl font-medium mb-3">Dates & Time</h2>
            <div className="mb-6 border-[2px] border-black p-3 rounded-md relative">
                <button
                    onClick={() => setIsOpen(true)}
                    className="absolute top-3 right-3 text-black text-sm"
                >
                    {mode === "editing" ? "Edit" : "Change"}
                </button>

                <p className="text-gray-400 text-xs">Pick-up date & time:</p>
                <p className="text-lg mb-2">{formatDateTime(dates.pickupDate, dates.pickupTime)}</p>

                <p className="text-gray-400 text-xs">Drop-off date & time:</p>
                <p className="text-lg">{formatDateTime(dates.dropoffDate, dates.dropoffTime)}</p>

                {loading && <p className="text-sm text-blue-600 mt-2">Loading booked dates...</p>}
                {error && <p className="text-sm text-red-500 mt-2">Error: {error}</p>}
            </div>

            {isOpen && (
                <DatePicker
                    showMonths={2}
                    showTime={true}
                    disabledDates={disabledDates} // Pass dynamically computed disabled dates
                    onClose={() => setIsOpen(false)} // Close the date picker on finish
                    onDateChange={handleDateChange} // Update dates state
                    currentDateTime={dates} // Pass current dates to pre-fill fields
                />
            )}
        </>
    );
};

export default DateTime;
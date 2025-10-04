// UseDatePicker.tsx
import { useState } from "react";
import DatePicker from "./DatePicker";

type SelectedDate = {
  pickupDate: Date | null;
  dropoffDate: Date | null;
  pickupTime: string | null;
  dropoffTime: string | null;
};

function UseDatePicker() {
  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState<SelectedDate>({
    pickupDate: null,
    dropoffDate: null,
    pickupTime: null,
    dropoffTime: null,
  });

  const bookedDates = [
    "2025-04-08",
    "2025-04-09",
    "2025-05-08",
    "2025-05-09",
    "2025-04-12",
    "2025-04-13",
    "2025-05-02",
    "2025-05-03",
    "2025-05-04",
    "2025-04-23",
  ];

  const formatDateTime = (date: Date | null, time: string | null): string => {
    if (!date || !time) return "";
    return `${date.toLocaleDateString()} ${time}`;
  };

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
    const pickupDate = new Date(startDate);
    const dropoffDate = new Date(endDate);

    setDates({
      pickupDate,
      dropoffDate,
      pickupTime: startTime,
      dropoffTime: endTime,
    });

  };

  return (
    <div className="p-8 mb-96">
      <h1 className="text-2xl font-bold mb-4">Booking Page</h1>

      <div className="relative inline-block">
        <input
          type="text"
          className="border px-2 py-3 rounded-md text-sm cursor-pointer w-80"
          readOnly
          value={
            dates.pickupDate && dates.dropoffDate
              ? `${formatDateTime(dates.pickupDate, dates.pickupTime)} → ${formatDateTime(
                  dates.dropoffDate,
                  dates.dropoffTime
                )}`
              : ""
          }
          onClick={() => setOpen(true)}
          placeholder="Select date and time"
        />

        {open && (
          <DatePicker
            showMonths={2}
            showTime={true}
            disabledDates={bookedDates}
            onDateChange={handleDateChange}
            onClose={() => setOpen(false)}
            currentDateTime={dates}
          />
        )}
      </div>
    </div>
  );
}

export default UseDatePicker;

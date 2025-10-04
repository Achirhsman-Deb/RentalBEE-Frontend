import React, { useState, useRef, useEffect } from 'react';
import DatePicker from '../DatePicker';
interface DateRange {
  pickupDate: Date | null;
  dropoffDate: Date | null;
  pickupTime: string | null;
  dropoffTime: string | null;
}

interface DateRangeSelectorProps {
  date: DateRange;
  setDate: React.Dispatch<React.SetStateAction<DateRange>>;
  bookeddates:string[]
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({date,setDate,bookeddates}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);



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

    setDate({
      pickupDate,
      dropoffDate,
      pickupTime: startTime,
      dropoffTime: endTime,
    });

    setShowDatePicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="date-range-selector" ref={containerRef}>
      <div
        className="mt-4 flex items-center gap-4 p-4 border border-black rounded-xl cursor-pointer"
        onClick={() => {
          setShowDatePicker(!showDatePicker);
        }}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-xl text-sm text-gray-500">
            {date.pickupDate && date.pickupTime
              ? formatDateTime(date.pickupDate, date.pickupTime)
              : "Pick-up Date"}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-xl text-sm text-gray-500">
            {date.dropoffDate && date.dropoffTime
              ? formatDateTime(date.dropoffDate, date.dropoffTime)
              : "Drop-off Date"}
          </div>
        </div>
      </div>
      {showDatePicker && (
        <div className="relative z-10 bg-white border border-gray-200 rounded-md shadow-lg mt-2">
          <DatePicker
            showMonths={2}
            showTime={true}
            disabledDates={bookeddates}
            onDateChange={handleDateChange}
            onClose={() => setShowDatePicker(false)}
            currentDateTime={date}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;

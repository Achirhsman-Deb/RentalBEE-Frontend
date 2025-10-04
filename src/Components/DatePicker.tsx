

import React, { useState, useEffect, useRef } from "react";
import { format, isSameDay, parseISO, isBefore, startOfDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface DatePickerProps {
  showMonths?: number;
  showTime?: boolean;
  onDateChange?: (dateRange: {
    startDate: string;
    endDate: string;
    startTime: string | null;
    endTime: string | null;
  }) => void;
  disabledDates?: string[];
  onClose?: () => void;
  currentDateTime?: {
    pickupDate: Date | null;
    pickupTime: string | null;
    dropoffDate: Date | null;
    dropoffTime: string | null;
  };
}

const DatePicker: React.FC<DatePickerProps> = ({
  showMonths: defaultShowMonths = 2,
  showTime = true,
  onDateChange = () => {},
  disabledDates = [],
  onClose,
  currentDateTime,
}) => {
  const now = new Date();
  const nowTimeStr = now.toTimeString().slice(0, 5);

  const [startDate, setStartDate] = useState<Date | null>(currentDateTime?.pickupDate ?? null);
  const [endDate, setEndDate] = useState<Date | null>(currentDateTime?.dropoffDate ?? null);
  const [pickTime, setPickTime] = useState(currentDateTime?.pickupTime ?? nowTimeStr);
  const [dropTime, setDropTime] = useState(currentDateTime?.dropoffTime ?? "16:00");
  const [monthOffset, setMonthOffset] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showMonths, setShowMonths] = useState(defaultShowMonths);
  const [error, setError] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [openUpward, setOpenUpward] = useState(false);
  const [openRightToLeft, setOpenRightToLeft] = useState(false);

  useEffect(() => {
    const updateShowMonths = () => {
      setShowMonths(window.innerWidth <= 650 ? 1 : defaultShowMonths);
    };

    updateShowMonths();
    window.addEventListener("resize", updateShowMonths);
    return () => window.removeEventListener("resize", updateShowMonths);
  }, [defaultShowMonths]);

  useEffect(() => {
    const calculateDropdownDirection = () => {
      if (wrapperRef.current && dropdownRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight;
        const dropdownWidth = dropdownRef.current.offsetWidth;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const spaceBelow = viewportHeight - rect.bottom; // Space below input
        const spaceAbove = rect.top; // Space above input
        const spaceLeft = rect.left; // Space to the left of input
        const spaceRight = viewportWidth - rect.right; // Space to the right of input

        // Decide vertical direction (upward or downward)
        setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight);

        // Decide horizontal direction (right-to-left or left-to-right)
        setOpenRightToLeft(spaceLeft > dropdownWidth && spaceRight < dropdownWidth);
      }
    };

    calculateDropdownDirection();
    window.addEventListener("resize", calculateDropdownDirection);
    return () => window.removeEventListener("resize", calculateDropdownDirection);
  }, []);

  const resetSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const today = startOfDay(new Date());

  const isTimeBeforeNow = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const selected = new Date();
    selected.setHours(hours, minutes, 0, 0);
    return selected < now;
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      setPickTime(isSameDay(date, today) ? nowTimeStr : "10:00");
      setError("");
    } else if (startDate && !endDate) {
      if (date >= startDate) {
        const includesDisabled = disabledDates.some((disabled) => {
          const d = parseISO(disabled);
          return d >= startDate && d <= date;
        });
        if (includesDisabled) {
          setError("Selected range includes a booked date.");
          resetSelection();
          return;
        }
        setEndDate(date);
        setError("");

        onDateChange({
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(date, "yyyy-MM-dd"),
          startTime: showTime ? pickTime : null,
          endTime: showTime ? dropTime : null,
        });
      } else {
        setError("End date must be after or same as start date.");
        resetSelection();
      }
    }
  };

  const handlePrevMonth = () => {
    setDirection(-1);
    setMonthOffset((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setDirection(1);
    setMonthOffset((prev) => prev + 1);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      onClose?.();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderSingleCalendar = (offset: number = 0) => {
    const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset + offset, 1);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = ([] as (Date | null)[])
      .concat(Array.from({ length: firstDay }, () => null))
      .concat(Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)));

    return (
      <div className="p-3 w-full">
        <div className="text-center font-semibold text-gray-700 mb-6">
          {format(viewDate, "MMMM yyyy")}
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} className="text-center">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, i) => {
            const isStart = date && startDate && isSameDay(date, startDate);
            const isEnd = date && endDate && isSameDay(date, endDate);
            const isSelected = isStart || isEnd;
            const isInRange = startDate && endDate && date && date > startDate && date < endDate;
            const isDisabledBooked = date && disabledDates.some((disabled) => isSameDay(date, parseISO(disabled)));
            const isPastDate = date && isBefore(date, today);

            return (
              <div key={i} className="flex flex-col items-center">
                <button
                  onClick={isDisabledBooked ? undefined : () => handleDateClick(date!)}
                  disabled={!date || !!isDisabledBooked || !!isPastDate}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full text-sm transition",
                    isSelected && "bg-black text-white",
                    isInRange && "bg-[#F1F1F1] text-black",
                    isDisabledBooked && "bg-[#CCCCCC] text-[#666666] cursor-not-allowed",
                    isPastDate && !isDisabledBooked && "cursor-not-allowed",
                    !isSelected && !isInRange && !isDisabledBooked && "hover:bg-[#F0F0F0]"
                  )}
                >
                  {date ? date.getDate() : ""}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div ref={wrapperRef} className="relative">
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: openUpward ? 10 : -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "absolute min-[650px]:w-[600px] bg-[#FFFBF3] rounded-xl shadow-md px-4 pb-4 border border-gray-200 overflow-hidden z-50",
          openUpward ? "bottom-full mb-2" : "top-full mt-2",
          openRightToLeft ? "right-0" : "left-0"
        )}
      >
        <div className="w-fit relative overflow-hidden">
          <div className="absolute top-7 left-4 z-10">
            <ChevronLeft
              onClick={handlePrevMonth}
              className="w-5 h-5 text-gray-600 cursor-pointer hover:scale-110 transition"
            />
          </div>
          <div className="absolute top-7 right-4 z-10">
            <ChevronRight
              onClick={handleNextMonth}
              className="w-5 h-5 text-gray-600 cursor-pointer hover:scale-110 transition"
            />
          </div>

          <div className="w-full mt-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={monthOffset}
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={cn("flex gap-4", showMonths === 1 ? "flex-col" : "flex-row")}
              >
                {renderSingleCalendar(0)}
                {showMonths === 2 && renderSingleCalendar(1)}
              </motion.div>
            </AnimatePresence>
          </div>

          {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}

          {showTime && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-2 gap-4 w-full">
              {/* Pick-up Time */}
              <div className="flex flex-col w-full sm:w-[50%]">
                <label className="text-xs text-black">Pick-up time</label>
                <input
                  type="time"
                  className="border border-black bg-[#FFFBF3] px-2 py-3 rounded-md text-sm"
                  value={pickTime}
                  min={startDate && isSameDay(startDate, today) ? nowTimeStr : undefined}
                  onChange={(e) => {
                    if (startDate && isSameDay(startDate, today) && isTimeBeforeNow(e.target.value)) {
                      setError("Pick-up time must be later than current time.");
                      setPickTime(nowTimeStr);
                    } else {
                      setError("");
                      setPickTime(e.target.value);
                      onDateChange({
                        startDate: format(startDate!, "yyyy-MM-dd"),
                        endDate: format(endDate!, "yyyy-MM-dd"),
                        startTime: e.target.value,
                        endTime: dropTime,
                      });
                    }
                  }}
                />
              </div>
              {/* Drop-off Time */}
              <div className="flex flex-col w-full sm:w-[50%]">
                <label className="text-xs text-black">Drop-off time</label>
                <input
                  type="time"
                  className="border border-black bg-[#FFFBF3] px-2 py-3 rounded-md text-sm"
                  value={dropTime}
                  onChange={(e) => {
                    setDropTime(e.target.value);
                    onDateChange({
                      startDate: format(startDate!, "yyyy-MM-dd"),
                      endDate: format(endDate!, "yyyy-MM-dd"),
                      startTime: pickTime,
                      endTime: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DatePicker;
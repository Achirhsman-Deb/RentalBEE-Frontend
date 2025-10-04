import React, { useEffect, useState } from "react";

interface DualHandleSliderProps {
  label: string;
  sliderMin?: number;
  sliderMax?: number;
  currMinValue: number;
  currMaxValue: number;
  onchange: (value: number[]) => void;
}

const DualHandleSlider: React.FC<DualHandleSliderProps> = ({
  label,
  sliderMin = 1000, 
  sliderMax = 8000,
  currMinValue,
  currMaxValue,
  onchange,
}) => {
  const [minValue, setMinValue] = useState(currMinValue);
  const [maxValue, setMaxValue] = useState(currMaxValue);

  const valueToPercentage = (value: number) =>
    ((value - sliderMin) / (sliderMax - sliderMin)) * 100;

  const handleMinPointerMove = (event: MouseEvent | TouchEvent) => {
    const clientX =
      "touches" in event ? event.touches[0].clientX : (event as MouseEvent).clientX;

    const slider = document.getElementById("slider");
    if (!slider) return;

    const sliderRect = slider.getBoundingClientRect();
    const percent =
      Math.max(0, Math.min((clientX - sliderRect.left) / sliderRect.width, 1)) *
      100;
    const newValue =
      Math.round((percent / 100) * (sliderMax - sliderMin)) + sliderMin;

    if (newValue < maxValue) {
      setMinValue(newValue);
      onchange([newValue, maxValue]);
    }
  };

  const handleMaxPointerMove = (event: MouseEvent | TouchEvent) => {
    const clientX =
      "touches" in event ? event.touches[0].clientX : (event as MouseEvent).clientX;

    const slider = document.getElementById("slider");
    if (!slider) return;

    const sliderRect = slider.getBoundingClientRect();
    const percent =
      Math.max(0, Math.min((clientX - sliderRect.left) / sliderRect.width, 1)) *
      100;
    const newValue =
      Math.round((percent / 100) * (sliderMax - sliderMin)) + sliderMin;

    if (newValue > minValue) {
      setMaxValue(newValue);
      onchange([minValue, newValue]);
    }
  };

  useEffect(() => {
    setMinValue(currMinValue);
    setMaxValue(currMaxValue);
  }, [currMinValue, currMaxValue]);

  const startDragging = (
    event: React.MouseEvent | React.TouchEvent,
    moveHandler: (e: MouseEvent | TouchEvent) => void
  ) => {
    event.preventDefault();
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("touchmove", moveHandler);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchend", stopDragging);
  };

  const stopDragging = () => {
    document.removeEventListener("mousemove", handleMinPointerMove);
    document.removeEventListener("mousemove", handleMaxPointerMove);
    document.removeEventListener("touchmove", handleMinPointerMove);
    document.removeEventListener("touchmove", handleMaxPointerMove);
    document.removeEventListener("mouseup", stopDragging);
    document.removeEventListener("touchend", stopDragging);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex justify-between mt-1 mb-3">
        <p className="text-gray-medium text-[0.9rem]">{label}</p>
        <span className="text-gray-medium text-sm">
          ₹{minValue} - ₹{maxValue}
        </span>
      </div>
      <div
        id="slider"
        className="relative bg-gray-light h-1 rounded w-full flex items-center pl-2"
      >
        <div
          className="absolute bg-[#FFD60A] h-1 rounded"
          style={{
            left: `${valueToPercentage(minValue)}%`,
            width: `${valueToPercentage(maxValue) - valueToPercentage(minValue)}%`,
          }}
        ></div>

        {/* Left Pointer (min handle) */}
        <span
          className="absolute h-[0.6rem] w-[0.3rem] bg-[#E6B800] rounded cursor-pointer -translate-x-1/2 transform flex items-center justify-center"
          style={{
            left: `${valueToPercentage(minValue)}%`,
          }}
          onMouseDown={(e) => startDragging(e, handleMinPointerMove)}
          onTouchStart={(e) => startDragging(e, handleMinPointerMove)}
        ></span>

        {/* Right Pointer (max handle) */}
        <span
          className="absolute h-[0.6rem] w-[0.3rem] bg-[#E6B800] rounded cursor-pointer transform -translate-x-1/2 flex items-center justify-center"
          style={{
            left: `${valueToPercentage(maxValue)}%`,
          }}
          onMouseDown={(e) => startDragging(e, handleMaxPointerMove)}
          onTouchStart={(e) => startDragging(e, handleMaxPointerMove)}
        ></span>
      </div>
    </div>
  );
};

export default DualHandleSlider;

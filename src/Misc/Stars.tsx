import { useState } from "react";

const renderStar = (starIndex: number) => {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const isActive = (hovered || rating) >= starIndex;
    const fillColor = isActive ? '#FACC15' : '#DCDCDD';

    return (
      <svg
        key={starIndex}
        width="28"
        height="28"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="cursor-pointer transition-all"
        onMouseEnter={() => setHovered(starIndex)}
        onMouseLeave={() => setHovered(0)}
        onClick={() => setRating(starIndex)}
      >
        <path
          d="M9.04896 2.92664C9.34833 2.00537 10.6517 2.00538 10.951 2.92664L12.0208 6.21864C12.1547 6.63063 12.5386 6.90957 12.9718 6.90958L16.4333 6.90971C17.402 6.90975 17.8047 8.1493 17.0211 8.71871L14.2208 10.7534C13.8703 11.008 13.7237 11.4594 13.8575 11.8714L14.927 15.1635C15.2263 16.0847 14.1719 16.8508 13.3882 16.2815L10.5878 14.247C10.2373 13.9924 9.76272 13.9924 9.41225 14.247L6.61179 16.2815C5.82809 16.8508 4.77367 16.0847 5.07297 15.1635L6.14249 11.8714C6.27634 11.4594 6.1297 11.008 5.77924 10.7534L2.97894 8.71871C2.19528 8.1493 2.59804 6.90975 3.56672 6.90971L7.02818 6.90958C7.46137 6.90957 7.8453 6.63063 7.97918 6.21864L9.04896 2.92664Z"
          fill={fillColor}
        />
      </svg>
    );
};

export default renderStar;
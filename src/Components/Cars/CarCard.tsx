import React from "react";
import Button from "../Button";
import { dafaultCarImage } from "../../Misc/CarImages";



// ==========================
// 🔨 How to Use CarCard Component:
// ==========================

// 1. Import CarCard in your file:
// import CarCard from "./CarCard";

// 2. Pass the required props to CarCard:

// Example usage:
// <CarCard
//   car={{
//     carId: "123",
//     carRating: "4.5",
//     imageUrl: "https://example.com/car-image.jpg",
//     location: "New York, NY",
//     model: "Tesla Model 3",
//     pricePerDay: "100",
//     serviceRating: "Excellent",
//     status: "AVAILABLE",  // can be one of ["AVAILABLE", "Reserved", "Service started", "Canceled", "Service provided", "Booking finished"]
//   }}
//   onBookClick={(car) => {
//     // Handle booking logic, e.g., open a booking modal
//     console.log("Booking car:", car);
//   }}
//   onDetailsClick={(car) => {
//     // Handle details click logic, e.g., redirect to car details page
//     console.log("Car details:", car);
//   }}
// />

// // 3. Customize:
// - The `car` prop must contain a valid `Car` object with the car’s details.
// - The `onBookClick` and `onDetailsClick` props are callbacks that execute when the user clicks the respective buttons.
//   - `onBookClick`: Triggers the booking logic (e.g., booking modal, API call).
//   - `onDetailsClick`: Redirects or shows more details about the car.



export interface Car {
  carId: string;
  carRating: string;
  imageUrl: string;
  images?: string[];
  locationIds: string[];
  location: string;
  model: string;
  pricePerDay: any; 
  serviceRating: string;
  status: string;
}

interface CarCardProps {
  car: Car;
  onBookClick: (car: Car) => void;
  onDetailsClick: (car: Car) => void;
}

const carDefaultImage = dafaultCarImage;

const CarCard: React.FC<CarCardProps> = ({ car, onBookClick, onDetailsClick }) => (
  <div className="bg-gray-100 rounded-xl shadow p-3 w-full max-w-xs mb-5">
    <div className="relative bg-[#ffffff] rounded-xl">
      <img
        src={car.imageUrl || carDefaultImage}
        alt={car.model}
        className="rounded-lg w-full h-44 object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = carDefaultImage;
        }}
      />
    </div>
    <div className="mt-4">
      <div className="flex items-center justify-between mt-2">
        <div>
          <h2 className="font-semibold text-sm">{car.model}</h2>
          <p className="text-xs text-gray-500">{car.location}</p>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span>{car.carRating}</span>
          <svg
            className="w-4 h-4 text-yellow-400 ml-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.19 3.674a1 1 0 00.95.69h3.862c.969 0 1.371 1.24.588 1.81l-3.124 2.27a1 1 0 00-.364 1.118l1.19 3.674c.3.921-.755 1.688-1.538 1.118l-3.124-2.27a1 1 0 00-1.176 0l-3.124 2.27c-.783.57-1.838-.197-1.538-1.118l1.19-3.674a1 1 0 00-.364-1.118L2.32 9.101c-.783-.57-.38-1.81.588-1.81h3.862a1 1 0 00.95-.69l1.19-3.674z" />
          </svg>
        </div>
      </div>
      <Button
        type="outline"
        width="w-[100%] mt-4"
        onClick={() => onBookClick(car)}
      >
        Book the car - ₹{car.pricePerDay}/day
      </Button>
      <Button
        type="underline"
        onClick={() => onDetailsClick(car)}
      >
        See more details
      </Button>
    </div>
  </div>
);

export default CarCard;
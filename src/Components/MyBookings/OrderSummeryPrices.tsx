import React from "react";

interface OrderSummeryPricesProps {
  days?: number;
  pricePerDay?: number;
  extraCharges?: number;
  discount?: number;
}

const OrderSummeryPrices: React.FC<OrderSummeryPricesProps> = ({
  days = 1,
  pricePerDay = 0,
  extraCharges = 0,
  discount = 0,
}) => {
  const subtotal = days * pricePerDay;
  const total = subtotal + extraCharges - discount;

  return (
    <div className="flex-1 flex flex-col justify-between p-4 h-auto bg-[#F0F0F0] rounded-lg min-w-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-2 text-sm sm:text-base">
        <div className="flex justify-between">
          <span>Price per day</span>
          <span>₹{pricePerDay.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        {extraCharges > 0 && (
          <div className="flex justify-between">
            <span>Extra Charges</span>
            <span>₹{extraCharges.toLocaleString()}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>- ₹{discount.toLocaleString()}</span>
          </div>
        )}
        <hr className="my-3" />
        <div className="flex justify-between font-bold text-base sm:text-lg">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummeryPrices;

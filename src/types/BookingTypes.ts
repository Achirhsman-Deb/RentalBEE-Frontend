export type BookingStatus = 'reserved' | 'reservedBySA' | 'serviceStarted' | 'serviceProvided' | 'serviceFinished' | 'canceled';

export interface Booking {
  id: string;
  carImage: string;
  carName: string;
  orderId: string;
  carId:string;
  date: string;
  status: BookingStatus;
}

export interface EditBookingPayload {
  bookingId: string;
  userId:string;
  token: string;
  updatedData: {
    pickupLocationId: string;
    dropoffLocationId: string;
    pickupDateTime: string; 
    dropoffDateTime: string;
  };
}
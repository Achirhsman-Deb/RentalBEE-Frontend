import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BookingTabs from '../Components/MyBookings/BookingTabs';
import BookingCard from '../Components/MyBookings/BookingCard';
import { BookingStatus, Booking } from '../types/BookingTypes';
import { fetchBookings } from '../slices/ThunkAPI/ThunkAPI';
import { AppDispatch, RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../Components/AlertProvider';
import Button from '../Components/Button';
import OrderSummery from '../Modals/OrderSummery';

const labelToStatusMap: Record<string, BookingStatus> = {
  'Booked' : 'booked',
  'Reserved': 'reserved',
  'Service started': 'serviceStarted',
  'Service provided': 'serviceProvided',
  'Booking finished': 'serviceFinished',
  'Cancelled': 'canceled',
};

const MyBookings = () => {
  const nav = useNavigate();
  const showAlert = useAlert();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTab, setSelectedTab] = useState('All bookings');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const UserId = useSelector((state: RootState) => state.auth.user?.userId);
  const bookings = useSelector((state: RootState) => state.booking.bookings);
  const loading = useSelector((state: RootState) => state.booking.loading);
  const error = useSelector((state: RootState) => state.booking.error);

  const getBookings = () => {
    if (UserId) {
      dispatch(fetchBookings({ UserId }));
    }
  }

  useEffect(() => {
    if (!UserId) {
      nav('/');
      showAlert({
        type: "error",
        title: "You are not logged in!",
        subtitle: "To continue booking a car, you need to log in or create an account",
        buttons: (
          <>
            <Button type="outline" width="w-20" onClick={() => nav('/')}>Cancel</Button>
            <Button type="filled" width="w-20" onClick={() => nav('/login')}>Login</Button>
          </>
        )
      });
      return;
    }
    getBookings();
  }, [dispatch, UserId, nav, showAlert]);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1536) setItemsPerPage(10);
      else if (window.innerWidth >= 1280) setItemsPerPage(8);
      else if (window.innerWidth >= 768) setItemsPerPage(6);
      else setItemsPerPage(4);
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const filteredBookings =
    selectedTab === 'All bookings'
      ? bookings
      : bookings.filter((b) => b.status === labelToStatusMap[selectedTab]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleOpenOrderSummary = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsOpen(true);
  };

  return (
    <div className="px-4 py-0 sm:px-6 md:px-10 sm:py-4 md:py-6 bg-[#FFFBF3] min-h-screen">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 mt-4">My bookings</h1>
      <BookingTabs selected={selectedTab} onChange={(tab) => { setSelectedTab(tab); setCurrentPage(1); }} />

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
          <p className="mt-4 text-lg text-gray-700">Fetching your bookings...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center mt-20">
          <p className="text-2xl font-semibold text-[#E6B800]">Oops! Something went wrong.</p>
          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      )}

      {/* Empty State - FIXED: Added check for !loading and !error */}
      {!loading && !error && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20">
          <p className="text-2xl font-semibold text-[#E6B800]">No past bookings</p>
        </div>
      )}

      {/* Data State */}
      {!loading && !error && bookings.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center sm:justify-items-stretch">
            {currentBookings.length > 0 ? (
                currentBookings.map((b) => (
                <BookingCard
                    key={b.id}
                    booking={b}
                    getBookingsFunc={getBookings}
                    OrderSummeryOpen={() => handleOpenOrderSummary(b)} 
                />
                ))
            ) : (
                <div className="col-span-full flex justify-center mt-10 text-gray-500">
                    No bookings found in this category.
                </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-10 space-x-2">
              {currentPage > 1 && (
                <button className="text-2xl" onClick={() => handlePageChange(currentPage - 1)}>
                  ◀
                </button>
              )}

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`h-8 w-8 flex items-center justify-center rounded-full ${currentPage === i + 1 ? 'bg-black text-white' : 'text-black'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              {currentPage < totalPages && (
                <button className="text-2xl" onClick={() => handlePageChange(currentPage + 1)}>
                  ▶
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* 🔹 Order Summary Modal */}
      <OrderSummery
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        Details={
          selectedBooking
            ? {
                carId: selectedBooking.carId,
                orderId: selectedBooking.id,
                status: selectedBooking.status,
              }
            : { carId: '', orderId: '', status: '' }
        }
      />
    </div>
  );
};

export default MyBookings;
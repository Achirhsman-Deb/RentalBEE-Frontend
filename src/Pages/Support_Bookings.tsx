import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useAlert } from "../Components/AlertProvider";
import { useNavigate } from "react-router-dom";
import { fetchSupportBookingById, fetchSupportBookings } from "../slices/ThunkAPI/ThunkAPI";
import BookingFilter from "../Components/support/Bookings/BookingFilters";
import BookingsTable from "../Components/support/Bookings/BookingTables";
import UserBookingDetailsModal from "../Modals/UserBookingDetailsModal";

const Support_Bookings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const myalert = useAlert();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading, totalPages, currentPage, error, Cars } = useSelector(
    (state: RootState) => state.support_bookings
  );
  const bookings = useSelector((state: RootState) => state.support_bookings.bookings);

  const { bookingDetails } = useSelector((state: RootState) => state.support_bookings);

  const [status, setStatus] = useState<"ALL" | "BOOKED" | "RESERVED" | "SERVICESTARTED" | "COMPLETED" | "CANCELED">("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Open modal and fetch booking details
  const handleViewDetails = (bookingId: string) => {
      if (!user?.idToken) return;
      setModalOpen(true);
      dispatch(fetchSupportBookingById({ id: bookingId, token: user?.idToken }));
  }

  useEffect(() => {
    if (!user?.idToken || loading) return;
    dispatch(
      fetchSupportBookings({
        status,
        page,
        limit: pageSize,
        token: user.idToken,
      })
    );
  }, [dispatch, status, page, pageSize, user?.idToken]);

  useEffect(() => {
    if (user?.role !== "SUPPORT_AGENT") {
      navigate("/");
      myalert({
        type: "error",
        title: "Unauthorized Access",
        subtitle: "You do not have permission to access this page.",
      });
    }
  }, []);

  // Filter logic
  const filteredBookings = useMemo(() => {
    let list = bookings;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((b: any) => {
        const name = `${b?.clientId?.firstName ?? ""} ${b?.clientId?.lastName ?? ""}`.toLowerCase();
        return name.includes(q);
      });
    }

    if (selectedCar) {
      list = list.filter((b: any) => b?.carId?.model === selectedCar);
    }

    return list;
  }, [search, bookings, selectedCar]);

  return (
    <>
      <div className="pl-5 text-black inline-flex items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mt-4">
          Bookings
        </h1>
      </div>

      <div className="min-h-screen p-4 text-black">
        <BookingFilter
          status={status}
          setStatus={setStatus}
          pageSize={pageSize}
          setPageSize={setPageSize}
          onSearch={setSearch}
          onCarFilter={setSelectedCar}
          cars={Cars}
        />

        {loading ? (
          <div className="text-center py-10 text-gray-600 font-semibold">
            Loading bookings...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <BookingsTable data={filteredBookings} onViewDetails={handleViewDetails} />
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 py-5">
            <button
              className="px-3 py-1 border rounded-md disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-3 py-1 border rounded-md disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {modalOpen && !loading && (
        <UserBookingDetailsModal
          bookingDetails={bookingDetails}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default Support_Bookings;

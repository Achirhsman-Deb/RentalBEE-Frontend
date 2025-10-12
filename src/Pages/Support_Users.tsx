import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchUsersWithDocuments } from "../slices/ThunkAPI/ThunkAPI";
import StatusFilter from "../Components/support/UserDocs/StatusFilter";
import UserTable from "../Components/support/UserDocs/UserTable";

const Support_Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, totalPages, currentPage, error } =
    useSelector((state: RootState) => state.support_userDocs);

  const [status, setStatus] = useState<"ALL" | "VERIFIED" | "UNVERIFIED">("ALL");
  const [page, setPage] = useState(1);

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchUsersWithDocuments({ status, page, limit: 10, token:user?.idToken }));
  }, [dispatch, status, page, user]);

  return (
    <>
      <div className="pl-9 text-sm text-black inline-flex items-center space-x-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 mt-4">
          Users
        </h1>
      </div>

      <div className="min-h-screen p-4 text-black space-y-4">
        <StatusFilter status={status} setStatus={setStatus} />
        {loading ? (
          <div className="flex justify-center py-10 text-gray-600 font-semibold">
            Loading users...
          </div>
        ) : error ? (
          <div className="flex justify-center py-10 text-red-500">
            {error}
          </div>
        ) : (
          <UserTable data={users} />
        )}

        {/* Pagination */}
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
    </>
  );
};

export default Support_Users;

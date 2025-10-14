import { useEffect, useMemo, useState } from "react";
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
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // fetch the page (unchanged)
    dispatch(
      fetchUsersWithDocuments({
        status,
        page,
        limit: pageSize,
        token: user?.idToken,
      })
    );
    // Optionally reset search when page or status changes:
    // setSearch("");
  }, [dispatch, status, page, user]);

  // filteredUsers is memoized for performance
  const filteredUsers = useMemo(() => {
    if (!users || users.length === 0) return [];
    if (!search) return users;

    const q = search.toLowerCase();
    return users.filter((u: any) => {
      // adjust property names depending on your user shape
      const nameCandidates = [
        u.name,
        u.fullName,
        u.username,
        // some systems store first/last separately
        `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
      ];

      return nameCandidates.some((c) =>
        String(c ?? "").toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  return (
    <>
      <div className="pl-5 text-black inline-flex items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-1 sm:mt-4 sm:mb-4 md:mt-6 md:mb-6 lg:mt-6 lg:mb-6">
          Users
        </h1>
      </div>

      <div className="min-h-screen p-4 text-black">
        <StatusFilter status={status} setStatus={setStatus} pageSize={pageSize}
          setPageSize={setPageSize} onSearch={setSearch} />
        {loading ? (
          <div className="flex justify-center py-10 text-gray-600 font-semibold">
            Loading users...
          </div>
        ) : error ? (
          <div className="flex justify-center py-10 text-red-500">{error}</div>
        ) : (
          // pass filtered list to UserTable
          <UserTable data={filteredUsers} />
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

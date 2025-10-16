import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { fetchUserDocumentsById } from "../../../slices/ThunkAPI/ThunkAPI";
import UserDetailsModal from "../../../Modals/UserDocsDetailsModal";

interface UserRow {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  documents: {
    AadhaarCard: string;
    DrivingLicense: string;
  };
}

interface UserTableProps {
  data: UserRow[];
}

const UserTable: React.FC<UserTableProps> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userDocuments, loading } = useSelector(
    (state: RootState) => state.support_userDocs
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ✅ Proper Date Formatting Function
  function formatDateTime(isoString: string) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedHours = String(hours).padStart(2, "0");
    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  }

  // ✅ Define columns (accessor only)
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phoneNumber" },
    { header: "Aadhaar", accessor: "documents.AadhaarCard" },
    { header: "License", accessor: "documents.DrivingLicense" },
    { header: "Created", accessor: "createdAt" },
  ];

  // Handle dropdown positioning
  useEffect(() => {
    if (dropdownIndex !== null && buttonRefs.current[dropdownIndex]) {
      const rect = buttonRefs.current[dropdownIndex]!.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX - 80,
      });
    }
  }, [dropdownIndex]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ✅ Handle “View Details” click
  const handleViewDetails = async (userId: string, row: UserRow) => {
    if (!user?.idToken) return;
    setSelectedUser(row);
    setModalOpen(true);
    setDropdownIndex(null);
    dispatch(fetchUserDocumentsById({ userId, token: user.idToken }));
  };

  return (
    <>
      <div
        className="overflow-x-auto max-w-full rounded-[8px] 
        [&::-webkit-scrollbar]:w-[1px]
        [&::-webkit-scrollbar]:h-[10px]
        [&::-webkit-scrollbar-track]:bg-[#F0F0F0]
        [&::-webkit-scrollbar-thumb]:bg-[#CBCBCB]
        [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <div className="border border-[#DCDCDD] min-w-[1100px] rounded-[8px] bg-transparent">
          <table className="w-full text-gray-700 border-collapse">
            <thead className="bg-black text-white text-[14px]">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-start font-semibold border-b-2 border-[#DCDCDD]"
                  >
                    {col.header}
                  </th>
                ))}
                <th className="px-4 py-3 text-center font-semibold border-b-2 border-[#DCDCDD]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIdx) => (
                <tr key={row.userId} className="hover:bg-stone-100">
                  {columns.map((col, colIdx) => {
                    let value: any;

                    if (col.accessor.includes(".")) {
                      value = col.accessor
                        .split(".")
                        .reduce((acc: any, key) => acc?.[key], row);
                    } else {
                      value = (row as any)[col.accessor];
                    }

                    // ✅ Format createdAt column
                    if (col.accessor === "createdAt" && value) {
                      value = formatDateTime(value);
                    }

                    return (
                      <td
                        key={colIdx}
                        className="px-4 py-3 border-b border-[#DCDCDD] text-sm"
                      >
                        {String(value || "N/A")}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center border-b border-[#DCDCDD]">
                    <button
                      ref={(el) => {
                        buttonRefs.current[rowIdx] = el;
                      }}
                      onClick={() =>
                        setDropdownIndex(dropdownIndex === rowIdx ? null : rowIdx)
                      }
                    >
                      <svg
                        className="h-4 w-4"
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.0647 12C4.0647 12.2652 4.17005 12.5196 4.35759 12.7071C4.54513 12.8946 4.79948 13 5.0647 13ZM11.0647 12C11.0647 12.2652 11.1701 12.5196 11.3576 12.7071C11.5451 12.8946 11.7995 13 12.0647 13ZM18.0647 12C18.0647 12.2652 18.1701 12.5196 18.3576 12.7071C18.5451 12.8946 18.7995 13 19.0647 13Z"
                          stroke="#666666"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dropdown */}
        {dropdownIndex !== null &&
          dropdownPosition &&
          createPortal(
            <div
              ref={dropdownRef}
              className="absolute z-50 bg-[#FFFBF3] border border-[#DCDCDD] rounded-[8px] shadow-md w-40"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                padding: "8px",
              }}
            >
              <ul className="py-1 text-sm text-gray-800 flex flex-col gap-[1px]">
                <li
                  className="px-4 py-2 hover:bg-black transition-all rounded-md cursor-pointer font-semibold hover:text-white text-[#666666]"
                  onClick={() =>
                    handleViewDetails(data[dropdownIndex!].userId, data[dropdownIndex!])
                  }
                >
                  View details
                </li>
              </ul>
            </div>,
            document.body
          )}
      </div>

      {/* User Details Modal */}
      {modalOpen && userDocuments && selectedUser && (
        <UserDetailsModal
          userDocuments={userDocuments}
          userInfo={{
            id: selectedUser.userId,
            name: selectedUser.name,
            email: selectedUser.email,
            phoneNumber: selectedUser.phoneNumber,
            createdAt: selectedUser.createdAt,
          }}
          onClose={() => setModalOpen(false)}
          loading={loading}
        />
      )}
    </>
  );
};

export default UserTable;

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/*
========================================================
📄 Booking Table Page - User Manual
========================================================

🏗️ Overview:
- Displays a list of bookings using a reusable DataTable component.
- Features: Select rows, View details, Cancel booking, Print all/selected rows.

📥 Inputs to DataTable:
- columns: [{ header, accessor }] → Defines table headers and fields.
- data: Booking records to display.
- onActionClick(action, rowData): Handle "View Details" or "Cancel" clicks.
- enableSelect: true → Enables row selection checkboxes.
- enableActionColumn: true → Shows action buttons for each row.
- onTableDataChange(selectedRows): Captures selected rows.

🛠️ Functionality:
- Select Rows → Select/deselect bookings with checkboxes.
- View Details → Log selected booking details to console.
- Cancel → Log cancellation action to console.
- Print All Rows → Logs all booking data.
- Print Selected Rows → Logs only selected rows.

📊 Displayed Booking Columns:
- Date
- Booking Number
- Client
- Car
- Made By
- Booking Status
- Booking Period

🔥 Example Console Logs:
- "View details clicked for:" {rowData}
- "Cancel clicked for:" {rowData}
- "All table rows:" [data]
- "Selected rows:" [selected]

📌 Notes:
- Console logs are for debugging.
- Extend with modals, page navigation, or API calls for production.

========================================================
*/


interface DataTableProps<T extends Record<string, any>> {
  columns: {
    header: string;
    accessor: keyof T;
    isActionColumn?: boolean;
  }[];
  data: T[];
  onActionClick?: (action: string, rowData: T) => void;
  enableSelect?: boolean;
  enableActionColumn?: boolean;
  onTableDataChange?: (selectedRows: T[]) => void;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onActionClick,
  enableSelect = false,
  enableActionColumn = true,
  onTableDataChange,
}: DataTableProps<T>) {
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (dropdownIndex !== null && buttonRefs.current[dropdownIndex]) {
      const rect = buttonRefs.current[dropdownIndex]!.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 150 + window.scrollX,
      });
    }
  }, [dropdownIndex]);

  useEffect(() => {
    onTableDataChange?.(selectedRows);
  }, [selectedRows, onTableDataChange]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownIndex !== null
      ) {
        setDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownIndex]);

  const toggleRowSelection = (rowData: T) => {
    setSelectedRows((prevRows) =>
      prevRows.some((row) => row.bookingNumber === rowData.bookingNumber)
        ? prevRows.filter((row) => row.bookingNumber !== rowData.bookingNumber)
        : [...prevRows, rowData]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data);
    }
  };

  return (
    <div
      className="overflow-x-auto max-w-full rounded-[8px]
      [&::-webkit-scrollbar]:w-[1px]
      [&::-webkit-scrollbar]:h-[10px]
      [&::-webkit-scrollbar-track]:bg-[#F0F0F0]
      [&::-webkit-scrollbar-thumb]:bg-[#CBCBCB] 
      [&::-webkit-scrollbar-thumb]:rounded-full "
    >
      <div className="border-[1px] border-[#DCDCDD] min-w-[1100px] rounded-[8px] bg-transparent">
        <table className="w-full text-gray-700 border-collapse">
          <thead className="bg-black text-[#FFFFFF] text-[14px] leading-[24px] tracking-normal capitalize whi">
            <tr>
              {enableSelect && (
                <th
                  className="px-4 py-3 text-start font-semibold"
                  style={{
                    borderBottom: "2px solid #DCDCDD",
                    borderRight: "1px solid #DCDCDD",
                  }}
                >
                  <label className="flex items-center justify-center w-4 h-4 border-2 border-[#ffffff] rounded-sm">
                    <input
                      type="checkbox"
                      className="appearance-none w-full h-full peer"
                      checked={
                        selectedRows.length === data.length && data.length > 0
                      }
                      onChange={toggleSelectAll}
                    />
                    <svg
                      className="absolute w-3 h-3 text-[#ffffff] hidden peer-checked:block"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </label>
                </th>
              )}
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 text-start font-semibold ${
                    !enableSelect && idx === 0 ? "rounded-tl-[8px]" : ""
                  }`}
                  style={{
                    borderTopLeftRadius:
                      idx === 0 && !enableSelect ? "8px" : undefined,
                    borderTopRightRadius:
                      idx === columns.length - 1 && enableActionColumn
                        ? "none"
                        : undefined,
                    borderRight:
                      idx === columns.length - 1 ? "none" : "1px solid #DCDCDD",
                    borderBottom: "2px solid #DCDCDD",
                  }}
                >
                  {col.header}
                </th>
              ))}
              {enableActionColumn && (
                <th
                  className="px-4 py-3 text-center font-semibold"
                  style={{
                    borderBottom: "2px solid #DCDCDD",
                    borderLeft: "1px solid #DCDCDD",
                  }}
                >
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="hover:bg-stone-100"
                style={{
                  borderBottomLeftRadius:
                    rowIdx === data.length - 1 ? "8px" : undefined,
                  borderBottomRightRadius:
                    rowIdx === data.length - 1 ? "8px" : undefined,
                }}
              >
                {enableSelect && (
                  <td
                    className="px-4 py-3 text-center"
                    style={{
                      borderBottom:
                        rowIdx === data.length - 1
                          ? "none"
                          : "1px solid #DCDCDD",
                      borderRight: "1px solid #DCDCDD",
                    }}
                  >
                    <label className="flex items-center justify-center w-4 h-4 border-2 border-[#666666] rounded-sm">
                      <input
                        type="checkbox"
                        className="appearance-none w-full h-full peer"
                        checked={selectedRows.some(
                          (row) =>
                            row.bookingNumber === data[rowIdx].bookingNumber
                        )}
                        onChange={() => toggleRowSelection(row)}
                      />
                      <svg
                        className="absolute w-3 h-3 text-[#666666] hidden peer-checked:block"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </label>
                  </td>
                )}
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className="px-4 py-3 text-[#000000]"
                    style={{
                      borderRight:
                        colIdx === columns.length - 1
                          ? "none"
                          : "1px solid #DCDCDD",
                      borderBottom:
                        rowIdx === data.length - 1
                          ? "none"
                          : "1px solid #DCDCDD",
                    }}
                  >
                    {String(row[col.accessor])}
                  </td>
                ))}
                {enableActionColumn && (
                  <td
                    className="px-4 py-3 text-center relative"
                    style={{
                      borderLeft: "1px solid #DCDCDD",
                      borderBottom:
                        rowIdx === data.length - 1
                          ? "none"
                          : "1px solid #DCDCDD",
                    }}
                  >
                    <button
                      ref={(el) => {
                        buttonRefs.current[rowIdx] = el;
                      }}
                      onClick={() =>
                        setDropdownIndex(
                          dropdownIndex === rowIdx ? null : rowIdx
                        )
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
                          d="M4.0647 12C4.0647 12.2652 4.17005 12.5196 4.35759 12.7071C4.54513 12.8946 4.79948 13 5.0647 13C5.32991 13 5.58427 12.8946 5.7718 12.7071C5.95934 12.5196 6.0647 12.2652 6.0647 12C6.0647 11.7348 5.95934 11.4804 5.7718 11.2929C5.58427 11.1054 5.32991 11 5.0647 11C4.79948 11 4.54513 11.1054 4.35759 11.2929C4.17005 11.4804 4.0647 11.7348 4.0647 12ZM11.0647 12C11.0647 12.2652 11.1701 12.5196 11.3576 12.7071C11.5451 12.8946 11.7995 13 12.0647 13C12.3299 13 12.5843 12.8946 12.7718 12.7071C12.9593 12.5196 13.0647 12.2652 13.0647 12C13.0647 11.7348 12.9593 11.4804 12.7718 11.2929C12.5843 11.1054 12.3299 11 12.0647 11C11.7995 11 11.5451 11.1054 11.3576 11.2929C11.1701 11.4804 11.0647 11.7348 11.0647 12ZM18.0647 12C18.0647 12.2652 18.1701 12.5196 18.3576 12.7071C18.5451 12.8946 18.7995 13 19.0647 13C19.3299 13 19.5843 12.8946 19.7718 12.7071C19.9593 12.5196 20.0647 12.2652 20.0647 12C20.0647 11.7348 19.9593 11.4804 19.7718 11.2929C19.5843 11.1054 19.3299 11 19.0647 11C18.7995 11 18.5451 11.1054 18.3576 11.2929C18.1701 11.4804 18.0647 11.7348 18.0647 12Z"
                          stroke="#666666"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dropdownIndex !== null &&
        dropdownPosition &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute z-50 bg-[#FFFBF3] border border-[#DCDCDD] rounded-[8px] shadow-md w-40"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              padding: "8px ",
            }}
          >
            <ul className="py-1 text-sm text-gray-800 flex flex-col gap-[1px]" >
              <li
                className="px-4 py-2 hover:bg-[#000000] transition-all rounded-md cursor-pointer font-semibold hover:text-[#FFFFFF] text-[#666666]"
                onClick={() => {
                  onActionClick?.("View details", data[dropdownIndex!]);
                  setDropdownIndex(null);
                }}
              >
                View details
              </li>
              <li
                className="px-4 py-2 hover:bg-[#000000] transition-all font-semibold rounded-md hover:text-[#FFFFFF] text-[#666666] cursor-pointer "
                onClick={() => {
                  onActionClick?.("Cancel", data[dropdownIndex!]);
                  setDropdownIndex(null);
                }}
              >
                Cancel
              </li>
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}
import React from "react";

interface StatusFilterProps {
  status: "ALL" | "VERIFIED" | "UNVERIFIED";
  setStatus: React.Dispatch<
    React.SetStateAction<"ALL" | "VERIFIED" | "UNVERIFIED">
  >;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ status, setStatus }) => {
  const options: ("ALL" | "VERIFIED" | "UNVERIFIED")[] = [
    "ALL",
    "VERIFIED",
    "UNVERIFIED",
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="font-medium text-gray-700">Filter by Status:</span>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition-all ${
              status === opt
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setStatus(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;

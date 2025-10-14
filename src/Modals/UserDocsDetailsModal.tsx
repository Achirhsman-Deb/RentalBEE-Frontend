import React from "react";
import { FileText, X } from "lucide-react";

interface DocumentDetails {
  documentUrl: string | null;
  status: string;
  fileName: string | null;
  fileSize: string | null;
}

interface UserDocuments {
  AadhaarCard: DocumentDetails;
  DrivingLicense: DocumentDetails;
}

interface UserInfo {
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt?: string;
}

interface Props {
  userDocuments: UserDocuments;
  userInfo: UserInfo;
  onClose: () => void;
  loading: boolean;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className ?? "h-4 w-full"}`}
  />
);

const UserDetailsModal: React.FC<Props> = ({
  userDocuments,
  userInfo,
  onClose,
  loading,
}) => {
  const renderDocumentSection = (key: keyof UserDocuments, title: string) => {
    const doc = userDocuments[key];
    const isVerified = doc.status === "VERIFIED";
    const formatSize = (size: number) => `${(size / 1024).toFixed(0)} KB`;

    return (
      <div key={key} className="mb-8">
        <section className="flex flex-row items-center gap-x-3 mb-4">
          <h2 className="font-semibold text-lg">{title}</h2>
          <span
            className={`px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium flex items-center justify-center ${
              isVerified ? "bg-lime-100 text-green" : "bg-red-100 text-red-600"
            }`}
          >
            {isVerified ? "VERIFIED" : "UNVERIFIED"}
          </span>
        </section>

        <section className="border p-4 rounded-lg space-y-4 bg-gray-50">
          {doc.documentUrl ? (
            <div className="flex items-center justify-between p-4 rounded-xl border bg-white">
              <div className="flex items-center gap-3">
                <FileText className="text-gray-600 w-5 h-5" />
                <div className="flex flex-col">
                  <p className="text-sm text-gray-900">{doc.fileName || "N/A"}</p>
                  <p className="text-xs text-gray-500">
                    {doc?.fileSize
                      ? formatSize(Number(doc.fileSize))
                      : "Unknown size"}
                  </p>
                </div>
              </div>

              <div className="flex gap-x-3">
                <a
                  href={doc.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm border rounded-md px-3 py-1 hover:bg-blue-50"
                >
                  View Document
                </a>
                {isVerified ? (
                  <a
                    onClick={() => {}}
                    rel="noopener noreferrer"
                    className="text-red-600 cursor-pointer text-sm border rounded-md px-3 py-1 hover:bg-red-50"
                  >
                    Reject
                  </a>
                ) : (
                  <a
                    onClick={() => {}}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green text-sm border rounded-md px-3 py-1 hover:bg-lime-100"
                  >
                    Verify
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-dashed bg-white text-center text-gray-500">
              No {title} uploaded
            </div>
          )}
        </section>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-[75] p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-[600px] max-w-[95%] p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold mb-6 text-center">
          User Details
        </h2>

        {/* User Info */}
        <div className="border p-4 rounded-lg mb-6 bg-gray-50">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <p>
                <span className="font-semibold">Name:</span> {userInfo.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {userInfo.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {userInfo.phoneNumber || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Joined:</span>{" "}
                {userInfo.createdAt
                  ? new Date(userInfo.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          )}
        </div>

        {/* Documents Section */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="border p-4 rounded-lg bg-gray-50 space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {Object.keys(userDocuments).map((key) =>
              renderDocumentSection(
                key as keyof UserDocuments,
                key === "AadhaarCard" ? "Aadhaar Card" : "Driving License"
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsModal;
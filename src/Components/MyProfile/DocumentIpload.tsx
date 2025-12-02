import { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import Button from "../Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { uploadDocumentThunk, getDocumentsThunk } from "../../slices/ThunkAPI/ThunkAPI";
import { Upload, FileText } from "lucide-react";
import { useAlert } from "../AlertProvider";

type UploadKeys = "aadhaarCard" | "drivingLicense";

const DocumentsUploader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { documents, loading, error: documentError } = useSelector((state: RootState) => state.documents);
  const showAlert = useAlert();

  const [files, setFiles] = useState<Record<UploadKeys, File | null>>({
    aadhaarCard: null,
    drivingLicense: null,
  });

  // Fetch existing user documents
  useEffect(() => {
    if (user?.userId) {
      dispatch(getDocumentsThunk({ userId: user.userId}));
    }
  }, [user, dispatch]);

  useEffect(() => {
  if (documentError) {
    showAlert({
      type: "error",
      title: "Error Fetching Documents",
      subtitle: `${documentError}`,
    });
  }
}, [documentError, showAlert]);

  const handleSelect = (key: UploadKeys, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (key: UploadKeys) => {
    if (!user?.userId || !user?.userId || !files[key]) return;

    try {
      await dispatch(
        uploadDocumentThunk({
          userId: user.userId,
          docType: key,
          file: files[key]!,
        })
      ).unwrap();

      await dispatch(getDocumentsThunk({ userId: user.userId }));
      setFiles((prev) => ({ ...prev, [key]: null }));
    } catch (error: any) {
      console.error(`Failed to upload ${key}:`, error);
      showAlert({
        type: "error",
        title: "Error Uploading Document",
        subtitle:
          `${error.message}`,
      });
    }
  };

  const formatFallbackSize = (size?: number | string | null) => {
    if (size == null) return "Unknown size";

    if (typeof size === "number") {
      if (size < 1024) return `${size} B`;
      return `${(size / 1024).toFixed(0)} KB`;
    }

    if (typeof size === "string") {
      const trimmed = size.trim();
      if (!trimmed) return "Unknown size";
      if (/^\d+$/.test(trimmed)) {
        const n = parseInt(trimmed, 10);
        if (n < 1024) return `${n} B`;
        return `${(n / 1024).toFixed(0)} KB`;
      }
      return trimmed;
    }

    return "Unknown size";
  };

  const displayName = (key: UploadKeys) => {
    const backendName = documents?.[key]?.fileName;
    if (backendName && backendName.trim().length > 0) return backendName;
    return key === "aadhaarCard" ? "Aadhaar Document" : "Driving License Document";
  };

  const hasExisting = (key: UploadKeys) => {
    // FIX 1: Only consider it "present" if there is a documentUrl
    return !!documents?.[key]?.documentUrl;
  };

  const renderSection = (key: UploadKeys, title: string) => {
    const existing = hasExisting(key);
    const newFile = files[key];
    const existingDoc = documents?.[key];

    return (
      <div className="mb-10">
        <section className="flex flex-row items-center gap-x-3 mb-4">
          <h2 className="font-semibold text-xl">{title}</h2>
          <span
            className={`px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium flex items-center justify-center
      ${existingDoc?.status === "UNVERIFIED"
                ? "bg-red-100 text-[#E22D0D]"
                : "bg-[#8df39e] text-[#00bf20]"
              }`}
          >
            {existingDoc?.status === "UNVERIFIED" ? "UNVERIFIED" : "VERIFIED"}
          </span>
        </section>

        <section className="border p-4 rounded-lg space-y-4">
          {existing && (
            <div className="flex items-center justify-between p-4 rounded-xl border bg-transparent">
              <div className="flex items-center gap-3">
                <FileText className="text-gray-600 w-5 h-5" />
                <div className="flex flex-col">
                  <p className="text-sm text-gray-900">
                    {displayName(key)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFallbackSize(existingDoc?.fileSize)}
                  </p>
                </div>
              </div>

              <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-100">
                <Upload className="w-4 h-4" />
                <span>Upload new</span>
                <input
                  id={`${key}-file-input`}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleSelect(key, e.target.files[0]);
                    }
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
          )}

          {!existing && !newFile && (
            <div className="space-y-3">
              <FileUpload
                onFileSelect={(file) => handleSelect(key, file)}
                variant="file"
                className="min-[600px]:w-[50%]"
              />
            </div>
          )}

          {/* New file selected (both first-time and replace flows show preview + Save + warning) */}
          {newFile && (
            <div className="space-y-2">
              <FileUpload
                key={`${key}-${newFile.name}-${newFile.size}`}
                onFileSelect={(file) => handleSelect(key, file)}
                variant="file"
                defaultFile={newFile}
                className="w-full"
                onRemove={() => {
                  handleSelect(key, null);

                  const input = document.querySelector<HTMLInputElement>(
                    `#${key}-file-input`
                  );
                  if (input) input.value = "";
                }}
              />

              <div className="flex items-center justify-between">
                <p className="text-xs text-amber-600">
                  ⚠️ Updating document will require verification again and remove the old one.
                </p>

                <Button
                  type="filled"
                  width="w-28"
                  onClick={() => handleSubmit(key)}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    );
  };

  return (
    <div className="p-6 mt-14 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Documents</h1>
      {renderSection("aadhaarCard", "Aadhaar Card")}
      {renderSection("drivingLicense", "Driving License")}
    </div>
  );
};

export default DocumentsUploader;
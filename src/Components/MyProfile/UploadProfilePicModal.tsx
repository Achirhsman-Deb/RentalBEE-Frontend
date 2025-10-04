import React, { useState } from "react";
import Button from "../Button";
import FileUpload from "./FileUpload";
import { useAlert } from "../AlertProvider";

interface PropType {
  isOpen: boolean;
  onClose: () => void;
  setFile: (file: File | null) => void; 
}

const UploadProfilePicModal: React.FC<PropType> = ({ isOpen, onClose, setFile }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const myAlert = useAlert();

  const handleSubmit = () => {
    if (!selectedFile) {
      myAlert({
        type: "error",
        title: "No file selected",
        subtitle: "Please select an image before uploading.",
      });
      return;
    }

    setFile(selectedFile);
    myAlert({
      type: "success",
      title: "Profile picture selected",
      subtitle: "Click 'Save Changes' to update.",
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 h-screen bg-gray-600 bg-opacity-50 flex items-center justify-center z-[99]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#F0F0F0] rounded-md p-5 sm:p-6 w-full max-w-md shadow-lg flex flex-col gap-y-5">
        <FileUpload
          onFileSelect={(file) => setSelectedFile(file)}
          variant="image"
          key="profile"
          className="w-full h-24"
        />

        <div className="flex flex-col sm:flex-row gap-y-3 sm:gap-y-0 sm:gap-x-4">
          <Button type="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="filled" onClick={handleSubmit}>
            Select
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadProfilePicModal;

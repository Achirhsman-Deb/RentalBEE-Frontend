import React from 'react';
import Button from '../Button';

interface PropType {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteDocsModal: React.FC<PropType> = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed h-screen  inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[99]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#F0F0F0] rounded-md p-5 sm:p-6 w-full max-w-md shadow-lg flex flex-col gap-y-5">
        <h2 className="text-2xl sm:text-3xl font-semibold">Delete Document?</h2>

        <p className="text-sm sm:text-base text-gray-500">
          You are about to delete a document. Are you sure you want to proceed?
        </p>

        <div className="flex flex-col sm:flex-row gap-y-3 sm:gap-y-0 sm:gap-x-4">
          <Button type="outline" onClick={onDelete}>
            Delete
          </Button>
          <Button type="filled" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDocsModal;

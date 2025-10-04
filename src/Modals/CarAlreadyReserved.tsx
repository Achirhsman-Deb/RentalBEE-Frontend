import React from 'react';
import Button from '../Components/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CarAlreadyReserved: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-[#FFFBF3] rounded-md p-6 w-120 shadow-lg">
        <h2 className="text-xl font-semibold text-black mb-2">Sorry,</h2>
        <p className="text-sm text-gray-700 mb-1">
          It seems like someone has already reserved this car.
        </p>
        <p className="text-sm text-gray-700 mb-4">
          You can find similar one{' '}
          <a href="#" className="underline text-black font-medium">
            here
          </a>
          .
        </p>
        <Button type='filled' onClick={onClose}>
          Ok
        </Button>
      </div>
    </div>
  );
};

export default CarAlreadyReserved;

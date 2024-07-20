import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-800 text-gray-100 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-6 text-center">{message}</h2>
        <div className="flex justify-center space-x-6">
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

import React, { type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div
        className="bg-gray-800 text-gray-100 p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-100 hover:text-gray-300"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

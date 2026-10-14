import React from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      onClick={onClose}
      className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[rgba(15,24,43,0.92)] text-white text-xs font-gallery-sans tracking-wide border border-white/20 shadow-2xl flex items-center gap-2 backdrop-blur-md cursor-pointer animate-fade-in"
    >
      <Check className="w-3.5 h-3.5 text-blue-400" />
      <span>{message}</span>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg'
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const widthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-4xl',
    '3xl': 'max-w-5xl'
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop (rendered behind at z-0) */}
      <div 
        className="fixed inset-0 bg-[#123D2A]/65 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog container with relative z-10 so it always renders sharply ABOVE the backdrop */}
      <div className="relative z-10 flex min-h-full items-center justify-center p-4 sm:p-6 text-center pointer-events-none">
        <div 
          className={`w-full ${widthClasses[maxWidth]} relative transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all border border-[#DDEBDD] pointer-events-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#DDEBDD] flex items-center justify-between bg-[#F7F8F4]">
            <div>
              <h3 className="text-base font-bold text-[#123D2A]">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-[#69746D] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[#69746D] hover:text-[#123D2A] p-1.5 rounded-lg hover:bg-[#DDEBDD]/50 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[82vh] overflow-y-auto bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

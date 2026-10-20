import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-[#218653] shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-[#C94C4C] shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-[#D99A32] shrink-0" />,
          info: <Info className="w-4 h-4 text-[#123D2A] shrink-0" />
        };

        const bgStyles = {
          success: 'bg-white border-[#218653]/30 text-[#123D2A]',
          error: 'bg-white border-[#C94C4C]/40 text-[#202923]',
          warning: 'bg-white border-[#D99A32]/40 text-[#202923]',
          info: 'bg-white border-[#DDEBDD] text-[#202923]'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg transition-all text-xs font-medium ${bgStyles[toast.type]}`}
          >
            <div className="mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 leading-snug">{toast.message}</div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#69746D] hover:text-[#202923] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

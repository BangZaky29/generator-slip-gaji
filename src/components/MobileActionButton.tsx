import React from 'react';
import { Eye, Edit3 } from 'lucide-react';

interface MobileActionButtonProps {
  viewMode: 'form' | 'preview';
  toggleView: () => void;
  onDownload?: () => void;
}

const MobileActionButton: React.FC<MobileActionButtonProps> = ({ viewMode, toggleView }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden flex flex-col gap-3">
      <button
        onClick={toggleView}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-95"
      >
        {viewMode === 'form' ? <Eye size={24} /> : <Edit3 size={24} />}
      </button>
    </div>
  );
};

export default MobileActionButton;

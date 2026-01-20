import React from 'react';
import { Eye, Edit3, Download, Check } from 'lucide-react';

interface MobileActionButtonProps {
  viewMode: 'form' | 'preview';
  toggleView: () => void;
  onDownload: () => void;
  downloadStatus: 'idle' | 'loading' | 'success';
}

const MobileActionButton: React.FC<MobileActionButtonProps> = ({ viewMode, toggleView, onDownload, downloadStatus }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden flex flex-col gap-3">
      {/* Show Download Button only in Preview Mode on Mobile */}
      {viewMode === 'preview' && (
          <button
            onClick={onDownload}
            disabled={downloadStatus === 'loading'}
            className={`
              p-4 rounded-full shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-white
              ${downloadStatus === 'success' 
                ? 'bg-green-600 hover:bg-green-700 shadow-green-900/30' 
                : 'bg-gray-900 hover:bg-gray-800'
              }
            `}
            title="Download PDF"
          >
            {downloadStatus === 'loading' ? (
                <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
            ) : downloadStatus === 'success' ? (
                <Check size={24} className="animate-in zoom-in duration-300" />
            ) : (
                <Download size={24} />
            )}
          </button>
      )}

      <button
        onClick={toggleView}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-95"
        title={viewMode === 'form' ? "Lihat Preview" : "Edit Data"}
      >
        {viewMode === 'form' ? <Eye size={24} /> : <Edit3 size={24} />}
      </button>
    </div>
  );
};

export default MobileActionButton;
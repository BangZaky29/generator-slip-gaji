import React from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface StampUploadProps {
  stamp?: string;
  onSave: (dataUrl: string) => void;
}

const StampUpload: React.FC<StampUploadProps> = ({ stamp, onSave }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSave(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
             <ImageIcon size={14} /> Stempel Perusahaan
          </label>
          {stamp && (
              <button 
                onClick={() => onSave('')}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                  <X size={12} /> Hapus
              </button>
          )}
      </div>

      {!stamp ? (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                <Upload size={24} className="mb-2" />
                <p className="text-xs text-center font-medium">Klik untuk upload stempel</p>
                <p className="text-[10px] text-gray-400 mt-1">PNG / JPG (Transparan)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
        </label>
      ) : (
        <div className="relative group border rounded-lg p-2 bg-white flex justify-center items-center h-32">
            <img src={stamp} alt="Stamp Preview" className="h-full object-contain opacity-90" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <label className="cursor-pointer text-white text-xs font-medium flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-white/30">
                    <Upload size={12} /> Ganti
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
            </div>
        </div>
      )}
    </div>
  );
};

export default StampUpload;
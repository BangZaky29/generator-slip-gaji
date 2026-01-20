import React from 'react';
import { SavedSlip, SalaryData } from '../types';
import { Trash2, FolderOpen, Save, History } from 'lucide-react';

interface SavedSlipsListProps {
  currentData: SalaryData;
  savedSlips: SavedSlip[];
  onSave: () => void;
  onLoad: (data: SalaryData) => void;
  onDelete: (id: string) => void;
}

const SavedSlipsList: React.FC<SavedSlipsListProps> = ({ 
  currentData, 
  savedSlips, 
  onSave, 
  onLoad, 
  onDelete 
}) => {
  return (
    <div className="space-y-4">
      {/* Save Button Area */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col gap-2">
        <p className="text-xs text-blue-700 mb-1">
            Simpan konfigurasi slip gaji saat ini ke browser agar bisa digunakan kembali nanti.
        </p>
        <button
            onClick={onSave}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow active:scale-95"
        >
            <Save size={18} /> Simpan Data Saat Ini
        </button>
      </div>

      {/* List Area */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <History size={14} /> Riwayat Tersimpan ({savedSlips.length})
        </h4>
        
        {savedSlips.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400">
                <FolderOpen className="mx-auto mb-2 opacity-50" size={32} />
                <p className="text-sm">Belum ada data tersimpan</p>
            </div>
        ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
                {savedSlips.map((item) => (
                    <div 
                        key={item.id} 
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-all group shadow-sm flex items-center justify-between"
                    >
                        <div className="overflow-hidden mr-2">
                            <h5 className="font-bold text-gray-800 text-sm truncate">{item.title}</h5>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                {new Date(item.timestamp).toLocaleString('id-ID', { 
                                    day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' 
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={() => onLoad(item.data)}
                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
                                title="Load Data"
                            >
                                <FolderOpen size={16} /> Buka
                            </button>
                            <button
                                onClick={() => onDelete(item.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                title="Hapus Data"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default SavedSlipsList;
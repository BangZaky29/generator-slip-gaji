import React, { useRef, useState } from 'react';
import { Download, Loader2, Check, CheckCircle, X, AlertTriangle } from 'lucide-react';
import Header from './components/Header';
import FormInput from './components/FormInput';
import PayslipPreview from './components/PayslipPreview';
import MobileActionButton from './components/MobileActionButton';
import { useStickyState } from './utils/localStorageHandler';
import { downloadPDF } from './utils/downloadPDF';
import { INITIAL_STATE, SavedSlip, SalaryData } from './types';

function App() {
  const [data, setData] = useStickyState<SalaryData>('salary-slip-data', INITIAL_STATE);
  const [savedSlips, setSavedSlips] = useStickyState<SavedSlip[]>('salary-slip-history', []);
  
  const [viewMode, setViewMode] = useState<'form' | 'preview'>('form');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error'} | null>(null);
  
  // Modal State
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'delete' | 'info';
  } | null>(null);
  
  const previewRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleView = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setViewMode(prev => prev === 'form' ? 'preview' : 'form');
  };

  const handleDownload = async () => {
    if (downloadStatus === 'loading') return;
    
    setDownloadStatus('loading');
    const filename = `Slip_Gaji_${data.employeeName.replace(/\s+/g, '_') || 'Karyawan'}_${data.period.replace(/\s+/g, '_')}`;
    
    // Give UI time to update
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await downloadPDF(previewRef.current, filename);
    
    setDownloadStatus('success');
    
    // Reset status after 3 seconds
    setTimeout(() => {
      setDownloadStatus('idle');
    }, 3000);
  };

  // --- Saved Slips Logic ---
  const handleSaveSlip = () => {
    const title = `${data.employeeName || 'Tanpa Nama'} - ${data.period}`;
    const newSlip: SavedSlip = {
        id: Date.now().toString(),
        title: title,
        timestamp: new Date().toISOString(),
        data: { ...data } // Create a deep copy of current state
    };
    
    // Add to top of list
    setSavedSlips([newSlip, ...savedSlips]);
    showToast('Data berhasil disimpan ke browser!', 'success');
  };

  const handleLoadSlip = (loadedData: SalaryData) => {
    setConfirmModal({
        show: true,
        title: 'Muat Data?',
        message: 'Apakah Anda yakin ingin memuat data ini? Data yang sedang diedit akan tertimpa.',
        type: 'info',
        onConfirm: () => {
            setData(loadedData);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showToast('Data berhasil dimuat', 'success');
            setConfirmModal(null);
        }
    });
  };

  const handleDeleteSlip = (id: string) => {
    setConfirmModal({
        show: true,
        title: 'Hapus Data?',
        message: 'Data yang dihapus tidak dapat dikembalikan.',
        type: 'delete',
        onConfirm: () => {
            setSavedSlips(prev => prev.filter(s => s.id !== id));
            showToast('Data berhasil dihapus', 'success');
            setConfirmModal(null);
        }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <Header />

      {/* Custom Confirmation Modal */}
      {confirmModal?.show && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 scale-100 animate-in zoom-in-95 duration-200 border border-gray-100">
                  <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full flex-shrink-0 ${confirmModal.type === 'delete' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                          <AlertTriangle size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{confirmModal.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">{confirmModal.message}</p>
                        
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setConfirmModal(null)}
                                className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors text-sm"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={confirmModal.onConfirm}
                                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors shadow-lg text-sm ${
                                    confirmModal.type === 'delete' 
                                    ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                                }`}
                            >
                                {confirmModal.type === 'delete' ? 'Ya, Hapus' : 'Ya, Muat'}
                            </button>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Toast Notification */}
      {toast?.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in zoom-in duration-300 w-[90%] max-w-sm">
            <div className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl border ${toast.type === 'success' ? 'bg-white border-green-100 text-gray-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {toast.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
                </div>
                <div>
                    <h4 className="font-bold text-sm">{toast.type === 'success' ? 'Berhasil' : 'Gagal'}</h4>
                    <p className="text-xs text-gray-500">{toast.message}</p>
                </div>
            </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* Form Section */}
          <div className={`w-full lg:w-5/12 xl:w-4/12 ${viewMode === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex justify-between items-center lg:hidden">
               <h2 className="font-bold text-lg">Editor</h2>
               <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Step 1</span>
            </div>
            <FormInput 
                data={data} 
                onChange={setData} 
                savedSlips={savedSlips}
                onSaveSlip={handleSaveSlip}
                onLoadSlip={handleLoadSlip}
                onDeleteSlip={handleDeleteSlip}
            />
          </div>

          {/* Preview Section - Sticky on Desktop */}
          <div className={`w-full lg:w-7/12 xl:w-8/12 ${viewMode === 'form' ? 'hidden lg:block' : 'block'} lg:sticky lg:top-8 lg:self-start`}>
             {/* Header - Hidden on Mobile */}
             <div className="hidden lg:flex z-20 mb-6 justify-between items-center bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-200">
                <h2 className="font-bold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                   Live Preview 
                   <span className="text-[10px] sm:text-xs font-normal text-white bg-green-500 px-2 py-0.5 rounded-full">A4 Size</span>
                </h2>
                <button 
                  onClick={handleDownload}
                  disabled={downloadStatus === 'loading'}
                  className={`
                    px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg
                    ${downloadStatus === 'success' 
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-900/20' 
                      : 'bg-gray-900 text-white hover:bg-gray-800 shadow-gray-900/20'}
                    ${downloadStatus === 'loading' ? 'opacity-80 cursor-wait' : ''}
                  `}
                >
                  {downloadStatus === 'loading' ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : downloadStatus === 'success' ? (
                    <Check size={18} />
                  ) : (
                    <Download size={18} />
                  )}
                  
                  <span className="hidden sm:inline font-medium">
                    {downloadStatus === 'loading' ? 'Generating...' : 
                     downloadStatus === 'success' ? 'Downloaded!' : 'Download PDF'}
                  </span>
                </button>
             </div>
             
             {/* Preview Container with Mobile Scaling */}
             <div className="flex justify-center overflow-hidden bg-gray-200/50 rounded-xl border border-gray-200 min-h-[500px] items-start pt-4 sm:pt-8 pb-8">
               <div className="transform scale-[0.43] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100 origin-top transition-transform duration-300">
                  <PayslipPreview data={data} forwardRef={previewRef} />
               </div>
             </div>
          </div>
        </div>
      </main>

      <MobileActionButton 
        viewMode={viewMode} 
        toggleView={toggleView} 
        onDownload={handleDownload}
        downloadStatus={downloadStatus}
      />
      
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
          display: block;
        }
      `}</style>
    </div>
  );
}

export default App;
import React, { useRef, useState } from 'react';
import { Download, Loader2, Check } from 'lucide-react';
import Header from './components/Header';
import FormInput from './components/FormInput';
import PayslipPreview from './components/PayslipPreview';
import MobileActionButton from './components/MobileActionButton';
import { useStickyState } from './utils/localStorageHandler';
import { downloadPDF } from './utils/downloadPDF';
import { INITIAL_STATE } from './types';

function App() {
  const [data, setData] = useStickyState('salary-slip-data', INITIAL_STATE);
  const [viewMode, setViewMode] = useState<'form' | 'preview'>('form');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const previewRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Form Section */}
          <div className={`w-full lg:w-5/12 xl:w-4/12 ${viewMode === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex justify-between items-center lg:hidden">
               <h2 className="font-bold text-lg">Editor</h2>
               <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Step 1</span>
            </div>
            <FormInput data={data} onChange={setData} />
          </div>

          {/* Preview Section */}
          <div className={`w-full lg:w-7/12 xl:w-8/12 ${viewMode === 'form' ? 'hidden lg:block' : 'block'}`}>
             <div className="sticky top-4 lg:top-20 z-20 mb-6 flex justify-between items-center bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-200">
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
                  <span className="sm:hidden font-medium">
                    {downloadStatus === 'loading' ? '...' : 
                     downloadStatus === 'success' ? 'Done' : 'PDF'}
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

      <MobileActionButton viewMode={viewMode} toggleView={toggleView} />
      
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
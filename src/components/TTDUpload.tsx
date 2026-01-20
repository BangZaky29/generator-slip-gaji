import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Upload, PenTool, CheckCircle, RefreshCcw } from 'lucide-react';

interface TTDUploadProps {
  signature?: string;
  onSave: (dataUrl: string) => void;
}

const TTDUpload: React.FC<TTDUploadProps> = ({ signature, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTab, setActiveTab] = useState<'draw' | 'upload'>('draw');

  useEffect(() => {
    // Add event listeners only when canvas is available (tab 'draw' active)
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventDefault = (e: TouchEvent) => {
        if (e.target === canvas) {
            e.preventDefault();
        }
    };
    
    // Add non-passive event listener to block scrolling
    canvas.addEventListener('touchstart', preventDefault, { passive: false });
    canvas.addEventListener('touchmove', preventDefault, { passive: false });
    canvas.addEventListener('touchend', preventDefault, { passive: false });

    return () => {
        canvas.removeEventListener('touchstart', preventDefault);
        canvas.removeEventListener('touchmove', preventDefault);
        canvas.removeEventListener('touchend', preventDefault);
    };
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2; // Slightly thinner for cleaner lines
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round'; 
    ctx.strokeStyle = '#000';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL());
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      onSave(''); 
    }
  };

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
        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
                type="button"
                onClick={() => setActiveTab('draw')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'draw' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <PenTool size={14} /> Gambar
            </button>
            <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <Upload size={14} /> Upload
            </button>
        </div>

      {activeTab === 'draw' ? (
        <div className="relative border-2 border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm hover:border-blue-300 transition-colors group">
            <canvas
                ref={canvasRef}
                width={600} 
                height={300}
                className="w-full h-[180px] cursor-crosshair bg-white touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
            
            {/* Floating Clear Button */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    type="button"
                    onClick={clearCanvas}
                    className="p-1.5 bg-white/90 text-red-600 rounded-lg hover:bg-red-50 border border-gray-200 shadow-sm backdrop-blur-sm"
                    title="Bersihkan Canvas"
                >
                    <RefreshCcw size={14} />
                </button>
            </div>
            
            <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none opacity-20 text-[10px] uppercase tracking-widest font-bold select-none">
                Area Tanda Tangan
            </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-[180px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                <Upload size={24} className="mb-2" />
                <p className="text-xs text-center font-medium">Klik untuk pilih gambar</p>
                <p className="text-[10px] text-gray-400 mt-1">Format: PNG (Transparan) / JPG</p>
            </div>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      )}

      {/* Signature Status / Preview */}
      {signature ? (
         <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-2.5 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-3">
                <div className="bg-white p-1 rounded border border-blue-100 w-16 h-10 flex items-center justify-center">
                    <img src={signature} alt="Preview" className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                    <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                        <CheckCircle size={12} /> Tersimpan
                    </span>
                    <p className="text-[10px] text-blue-600/80">Siap ditampilkan</p>
                </div>
            </div>
             <button 
                onClick={() => onSave('')} 
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Hapus"
            >
                 <Eraser size={14} />
            </button>
         </div>
      ) : (
          <div className="flex items-center justify-center gap-2 mt-2">
               <div className="h-1 w-1 rounded-full bg-gray-300"></div>
               <span className="text-[10px] text-gray-400 italic">Belum ada tanda tangan</span>
               <div className="h-1 w-1 rounded-full bg-gray-300"></div>
          </div>
      )}
    </div>
  );
};

export default TTDUpload;
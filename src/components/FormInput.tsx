import React, { useState } from 'react';
import { SalaryData, Allowance, Deduction, SavedSlip } from '../types';
import { Plus, Trash2, Building, User, DollarSign, FileText, ChevronDown, ChevronUp, Calendar, Save, History } from 'lucide-react';
import TTDUpload from './TTDUpload';
import StampUpload from './StampUpload';
import CompanyInfo from './CompanyInfo';
import SavedSlipsList from './SavedSlipsList';

interface FormInputProps {
  data: SalaryData;
  onChange: (newData: SalaryData) => void;
  savedSlips: SavedSlip[];
  onSaveSlip: () => void;
  onLoadSlip: (data: SalaryData) => void;
  onDeleteSlip: (id: string) => void;
}

// Reusable Number Input Component
const NumberInput = ({ 
    value, 
    onChange, 
    name, 
    className = "input-field !pl-12" 
}: { 
    value: number; 
    onChange: (val: number) => void; 
    name?: string; 
    className?: string; 
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Strip non-numeric characters
        const val = e.target.value.replace(/[^0-9]/g, '');
        onChange(val === '' ? 0 : parseInt(val, 10));
    };

    return (
        <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium z-10">Rp</span>
            <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name={name}
                value={value === 0 ? '' : value}
                onChange={handleChange}
                className={className}
                placeholder="-"
            />
        </div>
    );
};

const AccordionItem = ({ 
    title, 
    icon: Icon, 
    isOpen, 
    onToggle, 
    children,
    badge
}: { 
    title: string; 
    icon: any; 
    isOpen: boolean; 
    onToggle: () => void; 
    children: React.ReactNode;
    badge?: number;
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
            <button 
                type="button"
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isOpen ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
            >
                <div className="flex items-center gap-3 text-blue-800">
                    <div className={`p-2 rounded-lg ${isOpen ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Icon size={20} className={isOpen ? 'text-blue-600' : 'text-gray-500'} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                    {badge !== undefined && badge > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                            {badge}
                        </span>
                    )}
                </div>
                {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-5 pt-0 border-t border-gray-100">
                    <div className="mt-5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const FormInput: React.FC<FormInputProps> = ({ 
    data, 
    onChange, 
    savedSlips, 
    onSaveSlip, 
    onLoadSlip, 
    onDeleteSlip 
}) => {
  const [openSections, setOpenSections] = useState({
    history: false,
    company: false,
    letter: true,
    employee: true,
    financials: false,
    legal: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => {
        const isCurrentlyOpen = prev[section];
        return {
            history: false,
            company: false,
            letter: false,
            employee: false,
            financials: false,
            legal: false,
            [section]: !isCurrentlyOpen
        };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    onChange({
      ...data,
      [name]: isCheckbox 
        ? (e.target as HTMLInputElement).checked 
        : (type === 'number' ? Number(value) : value),
    });
  };

  // --- Allowance Logic ---
  const handleAllowanceChange = (id: string, field: keyof Allowance, value: string | number) => {
    const currentAllowances = data.allowances || [];
    const newAllowances = currentAllowances.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, allowances: newAllowances });
  };

  const addAllowance = () => {
    const newAllowance: Allowance = {
      id: Date.now().toString(),
      name: 'Tunjangan Baru',
      amount: 0,
    };
    onChange({ ...data, allowances: [...(data.allowances || []), newAllowance] });
  };

  const removeAllowance = (id: string) => {
    onChange({ ...data, allowances: (data.allowances || []).filter((a) => a.id !== id) });
  };

  // --- Deduction Logic ---
  const handleOtherDeductionChange = (id: string, field: keyof Deduction, value: string | number) => {
    const currentDeductions = data.otherDeductions || [];
    const newDeductions = currentDeductions.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, otherDeductions: newDeductions });
  };

  const addOtherDeduction = () => {
    const newDeduction: Deduction = {
      id: Date.now().toString(),
      name: 'Potongan Lain',
      amount: 0,
    };
    onChange({ ...data, otherDeductions: [...(data.otherDeductions || []), newDeduction] });
  };

  const removeOtherDeduction = (id: string) => {
    onChange({ ...data, otherDeductions: (data.otherDeductions || []).filter((d) => d.id !== id) });
  };

  const safeAllowances = data.allowances || [];
  const safeOtherDeductions = data.otherDeductions || [];

  return (
    <div className="space-y-4 pb-24">
      
      {/* 0. Saved History (NEW) */}
      <AccordionItem
        title="Riwayat Tersimpan"
        icon={History}
        isOpen={openSections.history}
        onToggle={() => toggleSection('history')}
        badge={savedSlips.length}
      >
        <SavedSlipsList 
            currentData={data}
            savedSlips={savedSlips}
            onSave={onSaveSlip}
            onLoad={onLoadSlip}
            onDelete={onDeleteSlip}
        />
      </AccordionItem>

      {/* 1. Company Info */}
      <AccordionItem 
        title="Informasi Perusahaan" 
        icon={Building} 
        isOpen={openSections.company}
        onToggle={() => toggleSection('company')}
      >
        <CompanyInfo data={data} onChange={onChange} />
      </AccordionItem>

      {/* 2. Letter Details (Header Info) */}
      <AccordionItem
        title="Detail Surat & Periode"
        icon={Calendar}
        isOpen={openSections.letter}
        onToggle={() => toggleSection('letter')}
      >
        <div className="space-y-4">
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="label">Judul Surat</label>
               <input name="slipTitle" value={data.slipTitle} onChange={handleChange} className="input-field" placeholder="SLIP GAJI" />
             </div>
             <div>
               <label className="label">Nomor Surat</label>
               <input name="slipNumber" value={data.slipNumber} onChange={handleChange} className="input-field" placeholder="INV/..." />
             </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="label">Periode Gaji</label>
              <input name="period" value={data.period} onChange={handleChange} className="input-field" placeholder="Januari 2026" />
             </div>
             <div>
              <label className="label">Tanggal Cetak</label>
              <input type="date" name="date" value={data.date} onChange={handleChange} className="input-field cursor-pointer" />
             </div>
           </div>
           <p className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-100">
             ℹ️ Informasi ini akan muncul di bagian Header (Kop Surat) slip gaji.
           </p>
        </div>
      </AccordionItem>

      {/* 3. Employee Info */}
      <AccordionItem 
        title="Identitas Karyawan" 
        icon={User} 
        isOpen={openSections.employee}
        onToggle={() => toggleSection('employee')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <div>
            <label className="label">NIK <span className="text-red-500">*</span></label>
            <input name="employeeNIK" value={data.employeeNIK} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="label">Nama Lengkap</label>
            <input name="employeeName" value={data.employeeName} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Jabatan</label>
            <input name="employeeRole" value={data.employeeRole} onChange={handleChange} className="input-field" />
          </div>
           <div>
            <label className="label">Status</label>
            <select name="employeeStatus" value={data.employeeStatus} onChange={handleChange} className="input-field cursor-pointer">
                <option value="TK/0">TK/0 (Tidak Kawin/0 Anak)</option>
                <option value="TK/1">TK/1</option>
                <option value="K/0">K/0 (Kawin/0 Anak)</option>
                <option value="K/1">K/1</option>
                <option value="K/2">K/2</option>
                <option value="K/3">K/3</option>
            </select>
          </div>
          <div>
             <label className="label">NPWP</label>
             <input name="employeeNPWP" value={data.employeeNPWP} onChange={handleChange} className="input-field" />
          </div>
        </div>
      </AccordionItem>

      {/* 4. Financials */}
      <AccordionItem 
        title="Rincian Gaji" 
        icon={DollarSign} 
        isOpen={openSections.financials}
        onToggle={() => toggleSection('financials')}
      >
        <div className="space-y-8">
          {/* Earnings */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                Pendapatan
            </h4>
            <div className="grid gap-4">
              <div>
                <label className="label">Gaji Pokok</label>
                <NumberInput 
                   value={data.basicSalary} 
                   onChange={(val) => onChange({ ...data, basicSalary: val })} 
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="label mb-3 block text-gray-800 font-bold">Tunjangan Tambahan</label>
              <div className="space-y-4">
                {safeAllowances.map((allowance) => (
                  <div key={allowance.id} className="p-3 border border-gray-100 rounded-lg bg-gray-50/50 space-y-2">
                    <input
                      value={allowance.name}
                      onChange={(e) => handleAllowanceChange(allowance.id, 'name', e.target.value)}
                      className="input-field w-full text-sm font-medium"
                      placeholder="Nama Tunjangan"
                    />
                    <div className="flex gap-2 items-center">
                        <NumberInput
                            value={allowance.amount}
                            onChange={(val) => handleAllowanceChange(allowance.id, 'amount', val)}
                            className="input-field !pl-12 w-full"
                        />
                        <button 
                            onClick={() => removeAllowance(allowance.id)} 
                            className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-100 bg-white"
                            title="Hapus"
                        >
                        <Trash2 size={18} />
                        </button>
                    </div>
                  </div>
                ))}
                <button 
                    onClick={addAllowance} 
                    className="w-full py-2.5 border-2 border-dashed border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium text-sm mt-2"
                >
                  <Plus size={16} /> Tambah Tunjangan
                </button>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-4"></div>

          {/* Deductions */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-red-500 rounded-full"></span>
                Potongan
            </h4>
            
            <div className="grid gap-4">
                {/* PPh 21 */}
                <div className={`border rounded-lg p-3 transition-colors ${data.includeTaxPph21 ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                        <input 
                            type="checkbox" 
                            name="includeTaxPph21" 
                            checked={data.includeTaxPph21} 
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        <span className={`font-medium ${data.includeTaxPph21 ? 'text-gray-800' : 'text-gray-500'}`}>PPh 21</span>
                    </div>
                    {data.includeTaxPph21 && (
                        <div className="mt-3 pl-8">
                            <NumberInput 
                                value={data.taxPph21} 
                                onChange={(val) => onChange({ ...data, taxPph21: val })} 
                                className="input-field !pl-12"
                            />
                        </div>
                    )}
                </div>

                {/* BPJS Kesehatan */}
                <div className={`border rounded-lg p-3 transition-colors ${data.includeBpjsHealth ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                        <input 
                            type="checkbox" 
                            name="includeBpjsHealth" 
                            checked={data.includeBpjsHealth} 
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        <span className={`font-medium ${data.includeBpjsHealth ? 'text-gray-800' : 'text-gray-500'}`}>BPJS Kesehatan</span>
                    </div>
                    {data.includeBpjsHealth && (
                        <div className="mt-3 pl-8">
                            <NumberInput 
                                value={data.bpjsHealth} 
                                onChange={(val) => onChange({ ...data, bpjsHealth: val })} 
                                className="input-field !pl-12"
                            />
                        </div>
                    )}
                </div>

                {/* BPJS Ketenagakerjaan */}
                <div className={`border rounded-lg p-3 transition-colors ${data.includeBpjsLabor ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                        <input 
                            type="checkbox" 
                            name="includeBpjsLabor" 
                            checked={data.includeBpjsLabor} 
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        <span className={`font-medium ${data.includeBpjsLabor ? 'text-gray-800' : 'text-gray-500'}`}>BPJS Ketenagakerjaan</span>
                    </div>
                    {data.includeBpjsLabor && (
                        <div className="mt-3 pl-8">
                             <NumberInput 
                                value={data.bpjsLabor} 
                                onChange={(val) => onChange({ ...data, bpjsLabor: val })} 
                                className="input-field !pl-12"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Other Deductions */}
            <div className="mt-5">
              <label className="label mb-3 block text-gray-800 font-bold">Potongan Lainnya</label>
              <div className="space-y-4">
                {safeOtherDeductions.map((deduction) => (
                  <div key={deduction.id} className="p-3 border border-gray-100 rounded-lg bg-gray-50/50 space-y-2">
                    <input
                      value={deduction.name}
                      onChange={(e) => handleOtherDeductionChange(deduction.id, 'name', e.target.value)}
                      className="input-field w-full text-sm font-medium"
                      placeholder="Nama Potongan"
                    />
                    <div className="flex gap-2 items-center">
                        <NumberInput
                            value={deduction.amount}
                            onChange={(val) => handleOtherDeductionChange(deduction.id, 'amount', val)}
                            className="input-field !pl-12 w-full"
                        />
                        <button 
                            onClick={() => removeOtherDeduction(deduction.id)} 
                            className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-100 bg-white"
                            title="Hapus"
                        >
                        <Trash2 size={18} />
                        </button>
                    </div>
                  </div>
                ))}
                <button 
                    onClick={addOtherDeduction} 
                    className="w-full py-2.5 border-2 border-dashed border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 font-medium text-sm mt-2"
                >
                  <Plus size={16} /> Tambah Potongan Lain
                </button>
              </div>
            </div>
          </div>
        </div>
      </AccordionItem>

      {/* 5. Footer & Legal */}
      <AccordionItem 
        title="Legalitas & Footer" 
        icon={FileText} 
        isOpen={openSections.legal}
        onToggle={() => toggleSection('legal')}
      >
        <div className="space-y-8">
           {/* Tanda Tangan - Moved to Top */}
           <div className="space-y-4">
            <label className="label block font-bold text-gray-800">Tanda Tangan (Pihak Perusahaan)</label>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm">
                <TTDUpload 
                    signature={data.signatureImage} 
                    onSave={(img) => onChange({ ...data, signatureImage: img })} 
                />
            </div>
            
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
               <div>
                   <label className="label">Nama Penandatangan</label>
                   <input name="hrName" value={data.hrName} onChange={handleChange} className="input-field" placeholder="Nama Lengkap" />
               </div>
               <div>
                   <label className="label">Jabatan Penandatangan</label>
                   <input name="hrTitle" value={data.hrTitle} onChange={handleChange} className="input-field" placeholder="HRD Manager" />
               </div>
            </div>
           </div>

           {/* Stempel */}
           <div className="space-y-4">
              <label className="label block font-bold text-gray-800">Stempel Resmi (Opsional)</label>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm">
                  <StampUpload 
                    stamp={data.stampImage}
                    onSave={(img) => onChange({ ...data, stampImage: img })}
                  />
              </div>
              <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  ℹ️ Stempel akan muncul di tengah tanda tangan secara otomatis pada preview. Gunakan gambar transparan (PNG) untuk hasil terbaik.
              </p>
           </div>
           
           {/* Catatan Khusus - Moved to Bottom */}
           <div>
            <label className="label">Catatan Khusus</label>
            <textarea name="note" value={data.note} onChange={handleChange} className="input-field h-24 resize-none" placeholder="Contoh: Bonus target tercapai..." />
           </div>
        </div>
      </AccordionItem>
    </div>
  );
};

export default FormInput;
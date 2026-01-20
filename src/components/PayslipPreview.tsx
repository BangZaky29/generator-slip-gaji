import React, { useMemo } from 'react';
import { SalaryData } from '../types';
import { formatRupiah, terbilang } from '../utils/formatUtils';

interface PayslipPreviewProps {
  data: SalaryData;
  forwardRef: React.RefObject<HTMLDivElement>;
}

const PayslipPreview: React.FC<PayslipPreviewProps> = ({ data, forwardRef }) => {
  const totalAllowance = useMemo(() => 
    data.allowances.reduce((acc, curr) => acc + curr.amount, 0), [data.allowances]
  );

  const totalOtherDeductions = useMemo(() => 
    data.otherDeductions.reduce((acc, curr) => acc + curr.amount, 0), [data.otherDeductions]
  );
  
  const totalEarnings = data.basicSalary + totalAllowance;
  
  // Calculate total deductions based on flags
  const totalDeductions = 
    (data.includeTaxPph21 ? data.taxPph21 : 0) + 
    (data.includeBpjsHealth ? data.bpjsHealth : 0) + 
    (data.includeBpjsLabor ? data.bpjsLabor : 0) +
    totalOtherDeductions;

  const netIncome = totalEarnings - totalDeductions;

  return (
    <div className="overflow-auto bg-gray-100/50 p-4 md:p-8 flex justify-center">
      {/* A4 Container */}
      <div 
        ref={forwardRef}
        className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-[15mm] relative text-[10pt] leading-relaxed text-gray-800"
        style={{ boxSizing: 'border-box' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
          <div className="flex gap-4 items-center">
            {data.companyLogo && (
              <img src={data.companyLogo} alt="Logo" className="w-16 h-16 object-contain" />
            )}
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wide">{data.companyName}</h1>
              <p className="text-sm text-gray-600 whitespace-pre-line">{data.companyAddress}</p>
              <p className="text-sm text-gray-600 mb-1">{data.companyPhone} | {data.companyEmail}</p>
              {data.companyWebsite && (
                <p className="text-sm text-blue-600 underline decoration-blue-300 underline-offset-2">
                    {data.companyWebsite}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800 uppercase">{data.slipTitle}</h2>
            <p className="text-sm text-gray-500">No: {data.slipNumber}</p>
          </div>
        </div>

        {/* Employee Info Grid */}
        <div className="grid grid-cols-2 gap-x-12 mb-8">
            <table className="w-full">
                <tbody>
                    <tr><td className="w-24 font-semibold">NIK</td><td>: {data.employeeNIK || '-'}</td></tr>
                    <tr><td className="font-semibold">Nama</td><td>: {data.employeeName || '-'}</td></tr>
                    <tr><td className="font-semibold">Jabatan</td><td>: {data.employeeRole || '-'}</td></tr>
                </tbody>
            </table>
            <table className="w-full">
                 <tbody>
                    <tr><td className="w-24 font-semibold">Periode</td><td>: {data.period || '-'}</td></tr>
                    <tr><td className="font-semibold">Status</td><td>: {data.employeeStatus}</td></tr>
                    <tr><td className="font-semibold">NPWP</td><td>: {data.employeeNPWP || '-'}</td></tr>
                </tbody>
            </table>
        </div>

        {/* Content Table */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          {/* Earnings */}
          <div className="break-inside-avoid">
            <h3 className="font-bold border-b border-gray-400 mb-2 pb-1 uppercase text-sm">Penerimaan</h3>
            <table className="w-full text-sm">
                <tbody>
                    <tr>
                        <td className="py-1">Gaji Pokok</td>
                        <td className="text-right">{formatRupiah(data.basicSalary)}</td>
                    </tr>
                    {data.allowances.map(a => (
                        <tr key={a.id}>
                            <td className="py-1">{a.name}</td>
                            <td className="text-right">{formatRupiah(a.amount)}</td>
                        </tr>
                    ))}
                    {/* Increased padding-top (pt-4) for cleaner PDF separation */}
                    <tr className="font-bold border-t border-gray-300">
                        <td className="pt-4 pb-2">Total Penerimaan (A)</td>
                        <td className="pt-4 pb-2 text-right">{formatRupiah(totalEarnings)}</td>
                    </tr>
                </tbody>
            </table>
          </div>

          {/* Deductions */}
          <div className="break-inside-avoid">
            <h3 className="font-bold border-b border-gray-400 mb-2 pb-1 uppercase text-sm">Potongan</h3>
            <table className="w-full text-sm">
                <tbody>
                    {data.includeTaxPph21 && (
                        <tr>
                            <td className="py-1">PPh 21</td>
                            <td className="text-right">{formatRupiah(data.taxPph21)}</td>
                        </tr>
                    )}
                     {data.includeBpjsHealth && (
                        <tr>
                            <td className="py-1">BPJS Kesehatan</td>
                            <td className="text-right">{formatRupiah(data.bpjsHealth)}</td>
                        </tr>
                    )}
                     {data.includeBpjsLabor && (
                        <tr>
                            <td className="py-1">BPJS Ketenagakerjaan</td>
                            <td className="text-right">{formatRupiah(data.bpjsLabor)}</td>
                        </tr>
                    )}
                    {data.otherDeductions.map(d => (
                        <tr key={d.id}>
                            <td className="py-1">{d.name}</td>
                            <td className="text-right">{formatRupiah(d.amount)}</td>
                        </tr>
                    ))}
                    {/* Increased padding-top (pt-4) for cleaner PDF separation */}
                    <tr className="font-bold border-t border-gray-300">
                        <td className="pt-4 pb-2">Total Potongan (B)</td>
                        <td className="pt-4 pb-2 text-right">{formatRupiah(totalDeductions)}</td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>

        {/* Net Income */}
        <div className="bg-gray-100 border border-gray-300 p-4 mb-6 break-inside-avoid rounded-sm">
             <div className="flex justify-between items-center mb-1">
                 <span className="font-bold text-lg uppercase">Penerimaan Bersih (A - B)</span>
                 <span className="font-bold text-xl text-blue-900">{formatRupiah(netIncome)}</span>
             </div>
             <div className="text-sm italic text-gray-600 border-t border-gray-300 pt-2 mt-1">
                 Terbilang: {terbilang(netIncome)} Rupiah
             </div>
        </div>

        {/* Note */}
        {data.note && (
             <div className="mb-8 break-inside-avoid">
                 <h4 className="font-bold text-sm mb-1">Catatan:</h4>
                 <p className="text-sm border border-gray-200 p-2 rounded bg-gray-50 whitespace-pre-wrap">{data.note}</p>
             </div>
        )}

        {/* Signatures */}
        <div className="flex justify-end mt-12 break-inside-avoid page-break-inside-avoid">
             <div className="text-center min-w-[200px] relative px-4">
                 <p className="text-sm">Jakarta, {new Date(data.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                 <p className="text-sm mb-4">Hormat Kami,</p>
                 
                 {/* Stamp Overlay - Centered and scaled */}
                 {data.stampImage && (
                     <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-32 h-32 flex items-center justify-center pointer-events-none z-0">
                        <img 
                            src={data.stampImage} 
                            className="w-full h-full object-contain opacity-80 mix-blend-multiply" 
                            alt="Stamp"
                        />
                     </div>
                 )}
                 
                 {/* Signature */}
                 <div className="h-24 flex items-end justify-center relative z-10 my-2">
                     {data.signatureImage ? (
                        <img src={data.signatureImage} className="max-h-24 max-w-full object-contain" alt="Signature" />
                     ) : (
                        <div className="h-24 w-full" /> 
                     )}
                 </div>

                 <div className="relative z-10">
                    <p className="font-bold border-b border-black inline-block min-w-[180px] pb-1">{data.hrName}</p>
                    <p className="text-xs text-gray-500 mt-1">{data.hrTitle || 'HRD Manager'}</p>
                 </div>
             </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-8 left-0 w-full text-center text-[8pt] text-gray-400 print:bottom-4">
             Dokumen ini dibuat secara otomatis dan sah.
        </div>
      </div>
    </div>
  );
};

export default PayslipPreview;
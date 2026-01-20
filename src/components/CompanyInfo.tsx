import React from 'react';
import { SalaryData } from '../types';

interface CompanyInfoProps {
  data: SalaryData;
  onChange: (newData: SalaryData) => void;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, companyLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
      <div className="col-span-2">
        <label className="label">Nama Perusahaan</label>
        <input name="companyName" value={data.companyName} onChange={handleChange} className="input-field" placeholder="PT. ..." />
      </div>
      <div className="col-span-2">
        <label className="label">Alamat</label>
        <input name="companyAddress" value={data.companyAddress} onChange={handleChange} className="input-field" />
      </div>
      <div>
        <label className="label">No HP / Telp</label>
        <input name="companyPhone" value={data.companyPhone} onChange={handleChange} className="input-field" />
      </div>
      <div>
        <label className="label">Email</label>
        <input name="companyEmail" value={data.companyEmail} onChange={handleChange} className="input-field" placeholder="hrd@company.com" />
      </div>
      <div className="col-span-2">
        <label className="label">Website</label>
        <input name="companyWebsite" value={data.companyWebsite} onChange={handleChange} className="input-field" />
      </div>
      <div className="col-span-2">
         <label className="label">Logo Perusahaan</label>
         <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>
    </div>
  );
};

export default CompanyInfo;
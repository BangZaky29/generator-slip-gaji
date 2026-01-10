import React, { useState, useRef } from 'react';
import { FileText, User, DollarSign, FileEdit, Download, ChevronDown, ChevronUp, Upload, X } from 'lucide-react';
import logoNs from './assets/NS_white_01.png';

// Component: Accordion untuk form sections
const Accordion = ({ title, icon: Icon, children, isOpen, onToggle }) => {
  return (
    <div className="mb-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="p-4 pt-0 border-t border-gray-100">{children}</div>}
    </div>
  );
};

// Component: Input Field
const InputField = ({ label, name, value, onChange, placeholder, type = "text" }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
      />
    </div>
  );
};

// Component: Textarea Field
const TextareaField = ({ label, name, value, onChange, placeholder, rows = 3 }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
      />
    </div>
  );
};

// Component: Image Upload
const ImageUpload = ({ label, onChange, preview, onRemove }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded" />
            <button
              onClick={onRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Klik untuk upload logo
            </button>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG hingga 2MB</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

// Component: Preview Slip Gaji
const PreviewSlipGaji = ({ data, logo }) => {
  const formatCurrency = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const totalPenghasilan = 
    parseInt(data.gajiPokok || 0) + 
    parseInt(data.tunjangan || 0);

  const totalPotongan = 
    parseInt(data.pph21 || 0) + 
    parseInt(data.bpjsKesehatan || 0) + 
    parseInt(data.bpjsKetenagakerjaan || 0);

  const penerimaanBersih = totalPenghasilan - totalPotongan;

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 print:border-0 print:shadow-none print:rounded-none min-h-[600px]">
      <div className="max-w-3xl border-2 border-gray-800 p-6">
        {/* Header */}
        <div className="text-center mt-1 pb-4 border-b-2 border-gray-300">
          {logo ? (
            <img src={logo} alt="Logo" className="h-16 mx-auto mb-3" />
          ) : (
            <div className="mb-2">
              <div className="h-16 bg-gray-100 rounded flex items-center justify-center mx-auto w-32">
                <span className="text-gray-400 text-xs">Logo</span>
              </div>
            </div>
          )}
          <h1 className="text-xl font-bold mb-1">{data.namaPerusahaan || 'NAMA PERUSAHAAN'}</h1>
          <p className="text-sm text-gray-600">{data.alamatPerusahaan || 'Alamat Perusahaan'}</p>
        </div>

        {/* Judul */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold mb-2">SLIP GAJI KARYAWAN</h2>
          <p className="text-sm">Periode: {data.periode || 'Januari 2026'}</p>
        </div>

        {/* Data Karyawan */}
        <div className="mb-6 space-y-2 text-sm">
          <div className="flex">
            <span className="w-24 font-medium">NIK</span>
            <span className="mr-2">:</span>
            <span>{data.nik || '-'}</span>
          </div>
          <div className="flex">
            <span className="w-24 font-medium">Nama</span>
            <span className="mr-2">:</span>
            <span>{data.namaKaryawan || '-'}</span>
          </div>
          <div className="flex">
            <span className="w-24 font-medium">Jabatan</span>
            <span className="mr-2">:</span>
            <span>{data.jabatan || '-'}</span>
          </div>
          <div className="flex">
            <span className="w-24 font-medium">Status</span>
            <span className="mr-2">:</span>
            <span>{data.status || 'TK/0'}</span>
          </div>
        </div>

        {/* Penghasilan */}
        <div className="mb-6">
          <h3 className="font-bold mb-3 bg-gray-100 p-2">PENGHASILAN</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Gaji Pokok</span>
              <span>Rp {formatCurrency(data.gajiPokok)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tunjangan</span>
              <span>Rp {formatCurrency(data.tunjangan)}</span>
            </div>
            <div className="flex justify-between font-bold border-t-2 border-gray-300 pt-2 mt-2">
              <span>Total (A)</span>
              <span>Rp {formatCurrency(totalPenghasilan)}</span>
            </div>
          </div>
        </div>

        {/* Potongan */}
        <div className="mb-6">
          <h3 className="font-bold mb-3 bg-gray-100 p-2">POTONGAN</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>PPh 21</span>
              <span>Rp {formatCurrency(data.pph21)}</span>
            </div>
            <div className="flex justify-between">
              <span>BPJS Kesehatan</span>
              <span>Rp {formatCurrency(data.bpjsKesehatan)}</span>
            </div>
            <div className="flex justify-between">
              <span>BPJS Ketenagakerjaan</span>
              <span>Rp {formatCurrency(data.bpjsKetenagakerjaan)}</span>
            </div>
            <div className="flex justify-between font-bold border-t-2 border-gray-300 pt-2 mt-2">
              <span>Total (B)</span>
              <span>Rp {formatCurrency(totalPotongan)}</span>
            </div>
          </div>
        </div>

        {/* Penerimaan Bersih */}
        <div className="mb-6 bg-blue-50 p-4 rounded border border-blue-200">
          <div className="flex justify-between items-center font-bold text-base">
            <span>PENERIMAAN BERSIH (A-B)</span>
            <span className="text-blue-700">Rp {formatCurrency(penerimaanBersih)}</span>
          </div>
          <p className="text-sm mt-2 text-gray-600">
            Terbilang: <span className="italic">{data.terbilang || 'Nol Rupiah'}</span>
          </p>
        </div>

        {/* Tanda Tangan */}
        <div className="mt-8 text-center">
          <p className="text-sm mb-1">{data.tempatTTD || 'Jakarta'}, {data.tanggalTTD ? formatDate(data.tanggalTTD) : '10 Januari 2026'}</p>
          <p className="text-sm font-semibold mb-16">{data.jabatanTTD || 'Manager HRD'}</p>
          <p className="text-sm">({data.namaTTD || '................................'})</p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [viewMode, setViewMode] = useState('form');
  const [openSections, setOpenSections] = useState({
    perusahaan: true,
    karyawan: false,
    penghasilan: false,
    potongan: false,
    ttd: false,
    logo: false
  });

  const [formData, setFormData] = useState({
    // Data Perusahaan
    namaPerusahaan: 'NAMA PERUSAHAAN',
    alamatPerusahaan: 'Alamat Perusahaan',
    periode: 'Januari 2026',
    
    // Data Karyawan
    nik: '',
    namaKaryawan: '',
    jabatan: '',
    status: 'TK/0',
    
    // Penghasilan
    gajiPokok: '0',
    tunjangan: '0',
    
    // Potongan
    pph21: '0',
    bpjsKesehatan: '0',
    bpjsKetenagakerjaan: '0',
    
    // Terbilang & TTD
    terbilang: 'Nol Rupiah',
    tempatTTD: 'Jakarta',
    tanggalTTD: '2026-01-10',
    jabatanTTD: 'Manager HRD',
    namaTTD: ''
  });

  const [logo, setLogo] = useState(null);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setLogo(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 no-print">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-32 h-32 border-gray-300 rounded-xl shadow-[5px_5px_12px_rgba(0,0,0,0.11)]">
              <img src={logoNs} alt="Logo" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Generator Slip Gaji Karyawan</h1>
              <p className="text-sm text-gray-600">Buat slip gaji dengan mudah dan profesional</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel - Form */}
          <div className={`lg:col-span-2 no-print ${viewMode === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <div className="flex items-start gap-2">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Tips:</p>
                  <p className="text-sm text-blue-800">
                    Pastikan semua nominal terisi dengan benar. Upload logo perusahaan untuk hasil yang lebih profesional.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 inline-flex items-center justify-center text-sm mr-2">1</span>
                Isi Data Slip Gaji
              </h2>

              {/* Data Perusahaan */}
              <Accordion
                title="Informasi Perusahaan"
                icon={FileText}
                isOpen={openSections.perusahaan}
                onToggle={() => toggleSection('perusahaan')}
              >
                <InputField
                  label="Nama Perusahaan"
                  name="namaPerusahaan"
                  value={formData.namaPerusahaan}
                  onChange={handleInputChange}
                  placeholder="NAMA PERUSAHAAN"
                />
                <TextareaField
                  label="Alamat Perusahaan"
                  name="alamatPerusahaan"
                  value={formData.alamatPerusahaan}
                  onChange={handleInputChange}
                  placeholder="Alamat Perusahaan"
                  rows={2}
                />
                <InputField
                  label="Periode"
                  name="periode"
                  value={formData.periode}
                  onChange={handleInputChange}
                  placeholder="Januari 2026"
                />
              </Accordion>

              {/* Data Karyawan */}
              <Accordion
                title="Data Karyawan"
                icon={User}
                isOpen={openSections.karyawan}
                onToggle={() => toggleSection('karyawan')}
              >
                <InputField
                  label="NIK"
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  placeholder="12345678"
                />
                <InputField
                  label="Nama Karyawan"
                  name="namaKaryawan"
                  value={formData.namaKaryawan}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
                <InputField
                  label="Jabatan"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  placeholder="Staff IT"
                />
                <InputField
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  placeholder="TK/0"
                />
              </Accordion>

              {/* Penghasilan */}
              <Accordion
                title="Penghasilan"
                icon={DollarSign}
                isOpen={openSections.penghasilan}
                onToggle={() => toggleSection('penghasilan')}
              >
                <InputField
                  label="Gaji Pokok"
                  name="gajiPokok"
                  value={formData.gajiPokok}
                  onChange={handleInputChange}
                  placeholder="5000000"
                  type="number"
                />
                <InputField
                  label="Tunjangan"
                  name="tunjangan"
                  value={formData.tunjangan}
                  onChange={handleInputChange}
                  placeholder="1000000"
                  type="number"
                />
              </Accordion>

              {/* Potongan */}
              <Accordion
                title="Potongan"
                icon={FileEdit}
                isOpen={openSections.potongan}
                onToggle={() => toggleSection('potongan')}
              >
                <InputField
                  label="PPh 21"
                  name="pph21"
                  value={formData.pph21}
                  onChange={handleInputChange}
                  placeholder="250000"
                  type="number"
                />
                <InputField
                  label="BPJS Kesehatan"
                  name="bpjsKesehatan"
                  value={formData.bpjsKesehatan}
                  onChange={handleInputChange}
                  placeholder="100000"
                  type="number"
                />
                <InputField
                  label="BPJS Ketenagakerjaan"
                  name="bpjsKetenagakerjaan"
                  value={formData.bpjsKetenagakerjaan}
                  onChange={handleInputChange}
                  placeholder="50000"
                  type="number"
                />
              </Accordion>

              {/* Tanda Tangan */}
              <Accordion
                title="Tanda Tangan"
                icon={FileEdit}
                isOpen={openSections.ttd}
                onToggle={() => toggleSection('ttd')}
              >
                <InputField
                  label="Terbilang (Penerimaan Bersih)"
                  name="terbilang"
                  value={formData.terbilang}
                  onChange={handleInputChange}
                  placeholder="Lima Juta Enam Ratus Ribu Rupiah"
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Tempat TTD"
                    name="tempatTTD"
                    value={formData.tempatTTD}
                    onChange={handleInputChange}
                    placeholder="Jakarta"
                  />
                  <InputField
                    label="Tanggal TTD"
                    name="tanggalTTD"
                    value={formData.tanggalTTD}
                    onChange={handleInputChange}
                    type="date"
                  />
                </div>
                <InputField
                  label="Jabatan Penanda Tangan"
                  name="jabatanTTD"
                  value={formData.jabatanTTD}
                  onChange={handleInputChange}
                  placeholder="Manager HRD"
                />
                <InputField
                  label="Nama Penanda Tangan"
                  name="namaTTD"
                  value={formData.namaTTD}
                  onChange={handleInputChange}
                  placeholder="Jane Smith"
                />
              </Accordion>

              {/* Upload Logo */}
              <Accordion
                title="Upload Logo"
                icon={Upload}
                isOpen={openSections.logo}
                onToggle={() => toggleSection('logo')}
              >
                <ImageUpload
                  label="Logo Perusahaan"
                  onChange={handleImageUpload}
                  preview={logo}
                  onRemove={handleRemoveImage}
                />
              </Accordion>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div
              className={`lg:col-span-3 print-area ${
                viewMode === 'form' ? 'hidden lg:block' : 'block'
              }`}
            >
            <div className="no-print mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 inline-flex items-center justify-center text-sm mr-2">2</span>
                  Pratinjau Hasil
                </h2>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm"
                >
                  <Download className="w-5 h-5" />
                  Cetak PDF
                </button>
              </div>
            </div>

            {/* PREVIEW LAYAR */}
            <PreviewSlipGaji data={formData} logo={logo} />
          </div>

        </div>
      </div>

      {/* Floating Action Button - Mobile Only */}
      <div className="fixed bottom-4 right-4 z-50 lg:hidden no-print">
        <button
          onClick={() => setViewMode(viewMode === 'form' ? 'preview' : 'form')}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-all active:scale-95"
          aria-label="Toggle View"
        >
          {viewMode === 'form' ? (
            <FileText className="w-6 h-6" />
          ) : (
            <FileEdit className="w-6 h-6" />
          )}
          <span className="sr-only">
            {viewMode === 'form' ? 'Lihat Preview' : 'Edit Form'}
          </span>
        </button>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            background: white;
          }

          /* SEMBUNYIKAN SEMUA UI */
          .no-print {
            display: none !important;
          }

          /* PASTIKAN PREVIEW TETAP TAMPIL */
          .print-area {
            display: block !important;
            width: 100%;
          }

          @page {
            size: A4;
            margin: 2cm;
          }
        }
      `}</style>
    </div>
  );
}
export interface Allowance {
  id: string;
  name: string;
  amount: number;
}

export interface Deduction {
  id: string;
  name: string;
  amount: number;
}

export interface SalaryData {
  // Employee Info
  employeeName: string;
  employeeNIK: string;
  employeeRole: string;
  employeeNPWP: string;
  employeeStatus: string; // TK/0, K/1

  // Company Info
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyLogo?: string; // base64

  // Slip Details
  slipTitle: string;
  slipNumber: string;
  period: string;
  date: string;

  // Earnings
  basicSalary: number;
  allowances: Allowance[];

  // Deductions Config
  includeTaxPph21: boolean;
  includeBpjsHealth: boolean;
  includeBpjsLabor: boolean;

  // Deductions Values
  taxPph21: number;
  bpjsHealth: number;
  bpjsLabor: number;
  otherDeductions: Deduction[];

  // Meta
  note: string;
  hrName: string;
  hrTitle: string; // Jabatan Penandatangan
  
  // Signatures
  signatureImage?: string; // base64
  stampImage?: string; // base64
}

export const INITIAL_STATE: SalaryData = {
  employeeName: '',
  employeeNIK: '',
  employeeRole: '',
  employeeNPWP: '',
  employeeStatus: 'TK/0',
  
  companyName: 'PT. MAJU MUNDUR SEJAHTERA',
  companyAddress: 'Jl. Sudirman No. 123, Jakarta Selatan',
  companyPhone: '(021) 555-1234',
  companyEmail: 'hrd@company.com',
  companyWebsite: 'www.company.com',
  
  slipTitle: 'SLIP GAJI',
  slipNumber: 'INV/2024/001',
  period: 'Januari 2026',
  date: new Date().toISOString().split('T')[0],
  
  basicSalary: 5000000,
  allowances: [
    { id: '1', name: 'Tunjangan Transport', amount: 500000 },
    { id: '2', name: 'Tunjangan Makan', amount: 500000 },
  ],
  
  // Deduction Flags
  includeTaxPph21: false,
  includeBpjsHealth: false,
  includeBpjsLabor: false,

  // Deduction Values
  taxPph21: 0,
  bpjsHealth: 0,
  bpjsLabor: 0,
  otherDeductions: [],
  
  note: '',
  hrName: 'Manager HRD',
  hrTitle: 'HRD Manager',
};
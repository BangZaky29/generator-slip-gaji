export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const terbilang = (nilai: number): string => {
  const angka = Math.abs(nilai);
  const baca = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];
  let terbilangStr = '';

  if (angka < 12) {
    terbilangStr = ' ' + baca[angka];
  } else if (angka < 20) {
    terbilangStr = terbilang(angka - 10) + ' Belas';
  } else if (angka < 100) {
    terbilangStr = terbilang(Math.floor(angka / 10)) + ' Puluh' + terbilang(angka % 10);
  } else if (angka < 200) {
    terbilangStr = ' Seratus' + terbilang(angka - 100);
  } else if (angka < 1000) {
    terbilangStr = terbilang(Math.floor(angka / 100)) + ' Ratus' + terbilang(angka % 100);
  } else if (angka < 2000) {
    terbilangStr = ' Seribu' + terbilang(angka - 1000);
  } else if (angka < 1000000) {
    terbilangStr = terbilang(Math.floor(angka / 1000)) + ' Ribu' + terbilang(angka % 1000);
  } else if (angka < 1000000000) {
    terbilangStr = terbilang(Math.floor(angka / 1000000)) + ' Juta' + terbilang(angka % 1000000);
  } else if (angka < 1000000000000) {
    terbilangStr = terbilang(Math.floor(angka / 1000000000)) + ' Milyar' + terbilang(angka % 1000000000);
  }

  return terbilangStr.trim();
};

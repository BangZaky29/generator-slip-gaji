import html2pdf from 'html2pdf.js';

export const downloadPDF = async (element: HTMLElement | null, filename: string) => {
  if (!element) return;

  const opt = {
    margin: [0, 0, 0, 0], // No margin, handled by CSS
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  // Temporarily remove shadow for cleaner print
  const originalShadow = element.style.boxShadow;
  element.style.boxShadow = 'none';

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('PDF Generation failed', error);
  } finally {
    element.style.boxShadow = originalShadow;
  }
};

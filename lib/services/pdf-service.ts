import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Converte um elemento HTML em um arquivo PDF e inicia o download.
 * @param elementId O ID do elemento HTML a ser capturado.
 * @param filename O nome do arquivo PDF a ser gerado (padrão: 'documento.pdf').
 */
export async function generatePdfFromHtml(
  elementId: string,
  filename: string = 'documento.pdf'
) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Elemento com ID "${elementId}" não encontrado.`);
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
}

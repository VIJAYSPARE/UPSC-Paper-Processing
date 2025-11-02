import jsPDF from 'jspdf';
// Fix: Corrected import path for types from `../components/BookCreator` instead of `../App`.
import { BookData, Paper } from '../components/BookCreator';

const MARGIN = 20;
const FONT_SIZE = 12;
const LINE_HEIGHT = 1.5;

export const exportToPdf = (bookData: BookData, papers: Paper[], fileName: string) => {
    const doc = new jsPDF();
    let y = MARGIN;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    const checkNewPage = (heightNeeded: number) => {
        if (y + heightNeeded > pageHeight - MARGIN) {
            doc.addPage();
            y = MARGIN;
        }
    };
    
    // Title Page
    doc.setFontSize(22);
    doc.text(bookData.title, pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.setFontSize(16);
    doc.text(bookData.subtitle, pageWidth / 2, y, { align: 'center' });
    y += 20;
    doc.setFontSize(14);
    doc.text(bookData.author, pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.text(bookData.publisher, pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.text(bookData.edition, pageWidth / 2, y, { align: 'center' });

    // Front Matter
    const addFrontMatter = (title: string, content: string) => {
        doc.addPage();
        y = MARGIN;
        doc.setFontSize(18);
        doc.text(title, MARGIN, y);
        y += 15;
        doc.setFontSize(FONT_SIZE);
        const lines = doc.splitTextToSize(content, pageWidth - MARGIN * 2);
        lines.forEach((line: string) => {
            checkNewPage(FONT_SIZE * 0.35); // Approx line height
            doc.text(line, MARGIN, y);
            y += FONT_SIZE * 0.5;
        });
    }

    addFrontMatter("प्रस्तावना (Preface)", bookData.preface);
    addFrontMatter("आभारप्रदर्शन (Acknowledgment)", bookData.acknowledgment);


    // Papers
    papers.forEach(paper => {
        doc.addPage();
        y = MARGIN;
        
        // Header
        doc.setFontSize(18);
        doc.text(`UPSC Civil Services Main Examination – ${paper.year || 'Unknown Year'}`, MARGIN, y);
        y += 10;
        doc.setFontSize(14);
        doc.text("General Studies Paper 1", MARGIN, y);
        y += 8;
        doc.setFontSize(12);
        doc.text(`Conducted in ${paper.year} | 20 Questions | 250 Marks`, MARGIN, y);
        y += 15;

        // Content
        const contentLines = paper.content.split('\n');
        contentLines.forEach(line => {
            const lines = doc.splitTextToSize(line.replace(/\*\*/g, '').replace(/\*/g, ''), pageWidth - MARGIN * 2);
            lines.forEach((textLine: string) => {
                checkNewPage(FONT_SIZE * 0.35);
                doc.text(textLine, MARGIN, y);
                y += FONT_SIZE * 0.5;
            });
        });
    });

    doc.save(fileName);
};
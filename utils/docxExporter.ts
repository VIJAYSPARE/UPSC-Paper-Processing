import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
// Fix: Corrected import path for types from `../components/BookCreator` instead of `../App`.
import { BookData, Paper } from '../components/BookCreator';

// Simple markdown parser for bold and italic
const parseMarkdown = (text: string): TextRun[] => {
    const runs: TextRun[] = [];
    // This regex handles segments of bold, italic, and normal text
    const regex = /(\*\*.*?\*\*|\*.*?\*|[^**]+)/g;
    let match;
    const textSegments = text.match(regex) || [];

    for (const segment of textSegments) {
        if (segment.startsWith('**') && segment.endsWith('**') && segment.length > 4) {
            runs.push(new TextRun({ text: segment.slice(2, -2), bold: true }));
        } else if (segment.startsWith('*') && segment.endsWith('*') && segment.length > 2) {
            runs.push(new TextRun({ text: segment.slice(1, -1), italics: true }));
        } else {
            runs.push(new TextRun(segment));
        }
    }
    
    // If no markdown is found, return the plain text
    if (runs.length === 0 && text.length > 0) {
        runs.push(new TextRun(text));
    }
    
    return runs;
};

const downloadBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

export const exportSingleDocx = (content: string, fileName: string) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: content.split('\n').map(line =>
                new Paragraph({
                    children: parseMarkdown(line),
                    spacing: { after: 100 }
                })
            ),
        }],
    });

    Packer.toBlob(doc).then(blob => {
        downloadBlob(blob, fileName);
    }).catch((error) => {
        console.error("Error creating DOCX file:", error);
    });
};

export const exportToDocx = (bookData: BookData, papers: Paper[], fileName: string) => {
    const titlePage = [
        new Paragraph({ text: bookData.title, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: bookData.subtitle, heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: " ", spacing: { after: 400 } }),
        new Paragraph({ text: bookData.author, heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: " ", spacing: { after: 400 } }),
        new Paragraph({ text: bookData.publisher, heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: bookData.edition, heading: HeadingLevel.HEADING_3, alignment: AlignmentType.CENTER, spacing: { after: 2000 } }),
    ];
    
    const frontMatter = [
        new Paragraph({ text: "प्रकाशक (Publisher)", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
        // Add publisher details if available
        new Paragraph({ text: " ", spacing: { after: 400 } }),
        new Paragraph({ text: "प्रस्तावना (Preface)", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
        ...bookData.preface.split('\n').map(line => new Paragraph({ children: parseMarkdown(line) })),
        new Paragraph({ text: " ", spacing: { after: 400 } }),
        new Paragraph({ text: "आभारप्रदर्शन (Acknowledgment)", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
        ...bookData.acknowledgment.split('\n').map(line => new Paragraph({ children: parseMarkdown(line) })),
    ];

    const paperSections = papers.flatMap(paper => {
        const header = [
            new Paragraph({ text: `UPSC Civil Services Main Examination – ${paper.year || 'Unknown Year'}`, heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
            new Paragraph({ text: "General Studies Paper 1", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: `Conducted in ${paper.year} | 20 Questions | 250 Marks`, heading: HeadingLevel.HEADING_3, spacing: { after: 400 } }),
        ];

        const content = paper.content.split('\n').map(line => 
            new Paragraph({
                children: parseMarkdown(line),
                spacing: { after: 100 }
            })
        );
        return [...header, ...content];
    });

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                ...titlePage,
                ...frontMatter,
                ...paperSections,
            ],
        }],
    });

    Packer.toBlob(doc).then(blob => {
        downloadBlob(blob, fileName);
    }).catch((error) => {
        console.error("Error creating DOCX file:", error);
    });
};

import { Document, Packer, Paragraph, TextRun } from 'docx';

export const exportToDocx = (content: string, fileName: string) => {
  // Split content by newlines to create separate paragraphs, preserving the structure
  const paragraphs = content.split('\n').map(line => 
    new Paragraph({
      children: [new TextRun(line)],
      spacing: {
        after: 100, // Add some space after paragraphs for readability
      }
    })
  );

  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs,
    }],
  });

  Packer.toBlob(doc).then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }).catch((error) => {
    console.error("Error creating DOCX file:", error);
  });
};

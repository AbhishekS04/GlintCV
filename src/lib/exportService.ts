import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    BorderStyle,
    ExternalHyperlink
} from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeData } from '../types/resume';

export async function exportToPDF(elementId: string, filename: string) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // 1. Capture Image with optimized settings for small file size
    const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced from 2 to 1.5 for significant size reduction
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        removeContainer: true
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.7); // Reduced from 0.85 to 0.7 for <2MB targets
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // 2. Add the image
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    // 3. SECRETE SAUCE: Detect links in DOM and map to PDF Annotations
    const links = element.querySelectorAll('a');
    const rootRect = element.getBoundingClientRect();

    links.forEach(link => {
        const rect = link.getBoundingClientRect();
        const url = link.getAttribute('href');
        if (!url) return;

        // Calculate coordinates relative to the preview container
        const left = ((rect.left - rootRect.left) / rootRect.width) * pdfWidth;
        const top = ((rect.top - rootRect.top) / rootRect.height) * pdfHeight;
        const width = (rect.width / rootRect.width) * pdfWidth;
        const height = (rect.height / rootRect.height) * pdfHeight;

        // Add invisible link annotation
        pdf.link(left, top, width, height, { url });
    });

    pdf.save(`${filename}.pdf`);
}

export async function exportToDOCX(data: ResumeData, filename: string) {
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: 720, bottom: 720, left: 720, right: 720 }, // 0.5 inch margins
                }
            },
            children: [
                // Header
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    heading: HeadingLevel.HEADING_1,
                    children: [
                        new TextRun({
                            text: `${data.personalDetails.firstName} ${data.personalDetails.lastName}`.toUpperCase(),
                            bold: true,
                            size: 32,
                            font: "Calibri",
                        }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: [
                                data.personalDetails.email,
                                data.personalDetails.phone,
                                data.personalDetails.location,
                            ].filter(Boolean).join(" | "),
                            size: 20,
                            font: "Calibri",
                        }),
                    ],
                }),
                // Links
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: data.personalDetails.links.flatMap((link, i) => [
                        new ExternalHyperlink({
                            children: [
                                new TextRun({
                                    text: link.label || link.url || 'Link',
                                    size: 18,
                                    color: "0000FF",
                                    underline: {},
                                    font: "Calibri",
                                }),
                            ],
                            link: link.url.startsWith('http') ? link.url : `https://${link.url}`,
                        }),
                        ...(i < data.personalDetails.links.length - 1 ? [new TextRun({ text: " | ", size: 18, font: "Calibri" })] : []),
                    ]),
                }),

                // Summary
                new Paragraph({ text: "", spacing: { before: 200 } }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                    children: [new TextRun({ text: "PROFESSIONAL SUMMARY", bold: true, size: 22, font: "Calibri" })],
                }),
                new Paragraph({
                    children: [new TextRun({ text: data.summary, size: 20, font: "Calibri" })],
                    spacing: { before: 100 },
                }),

                // Experience
                new Paragraph({ text: "", spacing: { before: 200 } }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                    children: [new TextRun({ text: "EXPERIENCE", bold: true, size: 22, font: "Calibri" })],
                }),
                ...data.experience.flatMap(exp => [
                    new Paragraph({
                        spacing: { before: 150 },
                        children: [
                            new TextRun({ text: exp.company, bold: true, size: 21, font: "Calibri" }),
                            new TextRun({ text: `\t${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, bold: true, size: 21, font: "Calibri" }),
                        ],
                        tabStops: [{ type: 'right', position: 9350 }] as any,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.position, italics: true, size: 20, font: "Calibri" }),
                            new TextRun({ text: `\t${exp.location}`, italics: true, size: 20, font: "Calibri" }),
                        ],
                        tabStops: [{ type: 'right', position: 9350 }] as any,
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: exp.description, size: 20, font: "Calibri" })],
                        spacing: { before: 80 },
                    })
                ]),

                // Education
                new Paragraph({ text: "", spacing: { before: 200 } }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                    children: [new TextRun({ text: "EDUCATION", bold: true, size: 22, font: "Calibri" })],
                }),
                ...data.education.map(edu =>
                    new Paragraph({
                        spacing: { before: 150 },
                        children: [
                            new TextRun({ text: `${edu.school}`, bold: true, size: 20, font: "Calibri" }),
                            new TextRun({ text: `\t${edu.graduationDate}`, bold: true, size: 20, font: "Calibri" }),
                        ],
                        tabStops: [{ type: 'right', position: 9350 }] as any,
                    })
                ),
                ...data.education.map(edu =>
                    new Paragraph({
                        children: [
                            new TextRun({ text: `${edu.degree} in ${edu.field}`, size: 20, font: "Calibri" }),
                            new TextRun({ text: `\t${edu.location}`, size: 20, font: "Calibri" }),
                        ],
                        tabStops: [{ type: 'right', position: 9350 }] as any,
                    })
                ),

                // Skills
                new Paragraph({ text: "", spacing: { before: 200 } }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                    children: [new TextRun({ text: "SKILLS", bold: true, size: 22, font: "Calibri" })],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Technical Skills: ", bold: true, size: 20, font: "Calibri" }),
                        new TextRun({ text: data.skills.join(", "), size: 20, font: "Calibri" })
                    ],
                    spacing: { before: 100 },
                }),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename}.docx`);
}

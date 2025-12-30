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

    // 1. Capture High Quality Image
    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        removeContainer: true,
        onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById(elementId);
            if (clonedElement) {
                clonedElement.style.transform = 'none';
                clonedElement.style.margin = '0';
                clonedElement.style.width = '210mm';
                // CRITICAL: Fix for word-merging "block of text" bug
                clonedElement.style.letterSpacing = 'normal';
                clonedElement.style.wordSpacing = 'normal';

                const allText = clonedElement.querySelectorAll('p, span, div, h1, h2, h3');
                allText.forEach(el => {
                    const style = (el as HTMLElement).style;
                    style.letterSpacing = 'normal';
                    style.wordSpacing = 'normal';
                    style.textAlign = 'left'; // Avoid justify which breaks spacing in canvas
                });

                clonedElement.parentElement!.style.padding = '0';
                clonedElement.parentElement!.style.height = 'auto';
                clonedElement.parentElement!.style.overflow = 'visible';
            }
        }
    });

    // 2. Prepare Single Page PDF with "Fit to Page" logic
    const imgData = canvas.toDataURL('image/jpeg', 0.9);
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    let imgHeightInMm = (canvas.height * pdfWidth) / canvas.width;
    let finalWidth = pdfWidth;
    let finalHeight = imgHeightInMm;

    if (imgHeightInMm > pdfHeight) {
        const ratio = pdfHeight / imgHeightInMm;
        finalHeight = pdfHeight;
        finalWidth = pdfWidth * ratio;
    }

    const xOffset = (pdfWidth - finalWidth) / 2;
    pdf.addImage(imgData, 'JPEG', xOffset, 0, finalWidth, finalHeight);

    // 3. Map All Links (Header + Experience)
    const links = element.querySelectorAll('a');
    const rootRect = element.getBoundingClientRect();

    links.forEach(link => {
        const rect = link.getBoundingClientRect();
        const url = link.getAttribute('href');
        if (!url) return;

        const relLeft = (rect.left - rootRect.left) / rootRect.width;
        const relTop = (rect.top - rootRect.top) / rootRect.height;
        const relWidth = rect.width / rootRect.width;
        const relHeight = rect.height / rootRect.height;

        const left = xOffset + (relLeft * finalWidth);
        const top = relTop * finalHeight;
        const width = relWidth * finalWidth;
        const height = relHeight * finalHeight;

        pdf.link(left, top, width, height, { url });
    });

    pdf.save(`${filename}.pdf`);
}

export async function exportToDOCX(data: ResumeData, filename: string) {
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: 720, bottom: 720, left: 720, right: 720 },
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
                // Personal Links
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
                    }),
                    // Experience Links
                    ...(exp.links && exp.links.length > 0 ? [
                        new Paragraph({
                            spacing: { before: 40 },
                            children: exp.links.flatMap((link, i) => [
                                new ExternalHyperlink({
                                    children: [
                                        new TextRun({
                                            text: link.label || 'View Project',
                                            size: 16,
                                            color: "0000FF",
                                            underline: {},
                                            font: "Calibri",
                                        }),
                                    ],
                                    link: link.url.startsWith('http') ? link.url : `https://${link.url}`,
                                }),
                                ...(i < exp.links!.length - 1 ? [new TextRun({ text: " • ", size: 16, font: "Calibri" })] : []),
                            ])
                        })
                    ] : [])
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

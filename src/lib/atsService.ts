import type { ResumeData } from '../types/resume';

export interface ScoreResult {
    score: number;
    checks: {
        label: string;
        passed: boolean;
        suggestion: string;
    }[];
}

export function calculateATSScore(data: ResumeData): ScoreResult {
    const checks = [];
    let score = 0;

    const hasContact = !!(data.personalDetails.email && data.personalDetails.phone);
    checks.push({
        label: "Contact Information",
        passed: hasContact,
        suggestion: hasContact ? "Perfect contact info." : "Add both email and phone number."
    });
    if (hasContact) score += 15;

    const hasLinkedIn = !!data.personalDetails.linkedin;
    checks.push({
        label: "LinkedIn Profile",
        passed: hasLinkedIn,
        suggestion: hasLinkedIn ? "Linked." : "Modern resumes need a LinkedIn URL."
    });
    if (hasLinkedIn) score += 10;

    const summaryLength = data.summary.trim().split(/\s+/).length;
    const validSummary = summaryLength >= 30 && summaryLength <= 80;
    checks.push({
        label: "Professional Summary",
        passed: validSummary,
        suggestion: validSummary ? "Well-balanced summary." : "Summary should be 30-80 words."
    });
    if (validSummary) score += 15;

    const expCount = data.experience.length;
    const hasExpDesc = data.experience.every(e => e.description.length > 50);
    checks.push({
        label: "Work Experience",
        passed: expCount >= 2 && hasExpDesc,
        suggestion: expCount < 2 ? "Add at least 2 roles." : (hasExpDesc ? "Detailed experience." : "Describe your impact more.")
    });
    if (expCount >= 2) score += 20;
    if (hasExpDesc) score += 10;

    const skillCount = data.skills.length;
    checks.push({
        label: "Skills Density",
        passed: skillCount >= 8,
        suggestion: skillCount >= 8 ? "Good skill range." : "Aim for at least 8 technical skills."
    });
    if (skillCount >= 8) score += 20;
    else if (skillCount > 0) score += 10;

    const hasNumbers = /([0-9]+%|[0-9]+\+|[0-9]+k|[0-9]+m|million|thousand)/gi.test(data.experience.map(e => e.description).join(" "));
    checks.push({
        label: "Quantifiable Impact",
        passed: hasNumbers,
        suggestion: hasNumbers ? "Impressive metrics!" : "Use numbers (%, $, #) to show results."
    });
    if (hasNumbers) score += 10;

    return {
        score: Math.min(score, 100),
        checks
    };
}

import type { ResumeData } from '../types/resume';

export interface ScoreResult {
    score: number;
    checks: {
        label: string;
        passed: boolean;
        suggestion: string;
    }[];
}

const ACTION_VERBS = [
    'led', 'managed', 'developed', 'architected', 'designed', 'implemented',
    'optimized', 'increased', 'decreased', 'saved', 'scaled', 'initiated',
    'transformed', 'delivered', 'automated', 'streamlined', 'coordinated',
    'mentored', 'collaborated', 'integrated', 'built', 'resolved', 'impacted'
];

const TECHNICAL_KEYWORDS = [
    'react', 'typescript', 'javascript', 'node', 'python', 'sql', 'aws', 'docker',
    'kubernetes', 'agile', 'scrum', 'ci/cd', 'api', 'backend', 'frontend', 'fullstack',
    'git', 'unit testing', 'rest', 'graphql', 'cloud', 'database', 'microservices'
];

export function calculateATSScore(data: ResumeData): ScoreResult {
    const checks = [];
    let score = 0;

    // 1. Contact Info & Essential Links (15 pts)
    const hasEmail = !!data.personalDetails.email;
    const hasPhone = !!data.personalDetails.phone;
    const hasLinkedIn = data.personalDetails.links.some(l => l.label.toLowerCase().includes('linkedin') || l.url.toLowerCase().includes('linkedin.com'));

    if (hasEmail && hasPhone) score += 10;
    if (hasLinkedIn) score += 5;

    checks.push({
        label: "Contact & Essential Links",
        passed: hasEmail && hasPhone && hasLinkedIn,
        suggestion: !hasEmail || !hasPhone ? "Add both email and phone number." : (!hasLinkedIn ? "Add a LinkedIn profile link." : "Contact info is solid.")
    });

    // 2. Professional Summary (15 pts)
    const summaryWords = data.summary.trim() ? data.summary.trim().split(/\s+/).length : 0;
    const validSummary = summaryWords >= 30 && summaryWords <= 70;
    if (validSummary) score += 15;
    else if (summaryWords > 0) score += 5;

    checks.push({
        label: "Professional Summary",
        passed: validSummary,
        suggestion: summaryWords === 0 ? "Add a summary to introduce yourself." : (validSummary ? "Well-balanced summary." : "Summary should be 30-70 words for better ATS reading.")
    });

    // 3. Work Experience Quality (30 pts)
    const expCount = data.experience.length;
    const allExpsHaveDesc = data.experience.every(e => e.description.length > 50);

    // Check for action verbs in experience
    const descText = data.experience.map(e => e.description.toLowerCase()).join(" ");
    const usedVerbs = ACTION_VERBS.filter(verb => descText.includes(verb));
    const hasActionVerbs = usedVerbs.length >= 5;

    if (expCount >= 2) score += 10;
    if (allExpsHaveDesc) score += 10;
    if (hasActionVerbs) score += 10;

    checks.push({
        label: "Experience Impact",
        passed: expCount >= 2 && allExpsHaveDesc && hasActionVerbs,
        suggestion: expCount < 2 ? "List at least 2 relevant roles." : (!hasActionVerbs ? "Use more action verbs (e.g., 'Optimized', 'Architected')." : "Good experience descriptions.")
    });

    // 4. Skills Density (20 pts)
    const skillCount = data.skills.length;
    const relevantSkills = data.skills.filter(s => TECHNICAL_KEYWORDS.some(kw => s.toLowerCase().includes(kw)));
    const hasEnoughSkills = skillCount >= 8;
    const hasRelevantSkills = relevantSkills.length >= 4;

    if (hasEnoughSkills) score += 10;
    if (hasRelevantSkills) score += 10;

    checks.push({
        label: "Skills Strategy",
        passed: hasEnoughSkills && hasRelevantSkills,
        suggestion: skillCount < 8 ? "Include at least 8-10 specific skills." : (!hasRelevantSkills ? "Add more core technical keywords (e.g., specific languages or tools)." : "Skills section is well-optimized.")
    });

    // 5. Quantifiable Metrics (10 pts)
    const hasNumbers = /([0-9]+%|[0-9]+\+|[0-9]+k|[0-9]+m|million|thousand)/gi.test(descText);
    if (hasNumbers) score += 10;

    checks.push({
        label: "Quantifiable Results",
        passed: hasNumbers,
        suggestion: hasNumbers ? "Great use of metrics!" : "Use numbers (%, $, #) to objectively prove your impact."
    });

    // 6. Section Completeness (10 pts)
    const hasEdu = data.education.length > 0;
    const hasProjects = data.projects.length > 0;
    if (hasEdu) score += 5;
    if (hasProjects) score += 5;

    checks.push({
        label: "Section Diversity",
        passed: hasEdu && hasProjects,
        suggestion: !hasEdu ? "Add your education." : (!hasProjects ? "Add projects to show practical application." : "All key sections present.")
    });

    return {
        score: Math.min(score, 100),
        checks
    };
}

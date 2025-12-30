import type { ResumeData } from '../types/resume';

const SYSTEM_PROMPT = `
You are an expert resume writer specializing in ATS (Applicant Tracking System) optimization.
Your task is to parse raw, messy, or notes-like career text and convert it into a perfectly structured JSON object matching the ResumeData interface.

CRITICAL RULES:
1. Always optimize for ATS (use standard headings, no tables, no icons).
2. Use strong action verbs (e.g., "Led", "Developed", "Optimized").
3. Quantify achievements (e.g., "Increased sales by 20%", "Reduced latency by 50ms").
4. Be concise but impactful.
5. Ensure the summary is professional and targeted.
6. The output MUST be a valid JSON object matching this structure:
{
  "personalDetails": { "firstName": "", "lastName": "", "email": "", "phone": "", "location": "", "portfolio": "", "linkedin": "", "github": "" },
  "summary": "...",
  "experience": [ { "id": "uuid", "company": "", "position": "", "location": "", "startDate": "", "endDate": "", "current": boolean, "description": "" } ],
  "education": [ { "id": "uuid", "school": "", "degree": "", "field": "", "location": "", "graduationDate": "" } ],
  "skills": ["skill1", "skill2"],
  "certifications": ["cert1"],
  "projects": [ { "id": "uuid", "name": "", "description": "" } ],
  "achievements": ["achievement1"]
}
`;

export async function processWithAI(text: string, vendor: string, apiKey: string): Promise<ResumeData> {
    if (!apiKey) throw new Error("API Key is required.");

    let endpoint = "";
    let body = {};
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (vendor === 'openai') {
        endpoint = "https://api.openai.com/v1/chat/completions";
        headers["Authorization"] = `Bearer ${apiKey}`;
        body = {
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `Convert this text to a structured resume: ${text}` }
            ],
            response_format: { type: "json_object" }
        };
    } else if (vendor === 'openrouter') {
        endpoint = "https://openrouter.ai/api/v1/chat/completions";
        headers["Authorization"] = `Bearer ${apiKey}`;
        body = {
            model: "openai/gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `Convert this text to a structured resume: ${text}` }
            ]
        };
    } else if (vendor === 'google') {
        endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
        body = {
            contents: [{
                parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Input:\n${text}` }]
            }],
            generationConfig: {
                responseMimeType: "application/json",
            }
        };
    }

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || "AI Request failed");
        }

        const result = await response.json();
        let content = "";

        if (vendor === 'openai' || vendor === 'openrouter') {
            content = result.choices[0].message.content;
        } else if (vendor === 'google') {
            content = result.candidates[0].content.parts[0].text;
        }

        return JSON.parse(content) as ResumeData;
    } catch (error) {
        console.error("AI Processing Error:", error);
        throw error;
    }
}

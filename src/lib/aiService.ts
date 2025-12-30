import type { ResumeData } from '../types/resume';

const SYSTEM_PROMPT = `
You are a high-performance AI Resume Architect. Your specialty is "Data-to-Resume" conversion, specifically handling raw code, ChatGPT JSON outputs, or messy notes.

OBJECTIVE:
Transform ANY input (especially code or technical snippets) into a professional, high-impact resume.

PARSING LOGIC FOR CODE/TECHNICAL INPUT:
1. RAW CODE (React, Python, SQL, etc.):
   - Treat the code as a "Project" or "Experience".
   - Extract the core purpose: What is this code accomplishing? (e.g., "Building a real-time analytics dashboard").
   - Extract technologies: Detect frameworks, libraries, and languages.
   - Convert logic into bullet points: Use action verbs.
2. ChatGPT/LLM OUTPUTS:
   - If the user pastes a "resume JSON" or "here is a resume I made for you..." block, extract the data exactly and professionalize it.
3. MESSY NOTES:
   - Standardize all dates, titles, and formatting.

CONSTRAINTS:
- One-column, ATS-safe format.
- NO raw code blocks in final output.
- Output MUST be valid JSON matching the structure below.

OUTPUT STRUCTURE:
{
  "personalDetails": { 
    "firstName": "", "lastName": "", "email": "", "phone": "", "location": "",
    "links": [ { "label": "GitHub", "url": "..." } ]
  },
  "summary": "Impact-driven summary (30-60 words)",
  "experience": [ 
    { "id": "uuid", "company": "", "position": "", "location": "", "startDate": "", "endDate": "", "current": false, "description": "Quantified bullets..." } 
  ],
  "education": [ { "id": "uuid", "school": "", "degree": "", "field": "", "location": "", "graduationDate": "" } ],
  "skills": ["React", "TypeScript", "Node.js"],
  "certifications": [],
  "projects": [ { "id": "uuid", "name": "", "description": "Impact focus", "link": "" } ],
  "achievements": []
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

import type { ResumeData } from '../types/resume';

const SYSTEM_PROMPT = `
You are a high-performance AI Resume Architect. Your specialty is "Zero-Loss" Data-to-Resume conversion.

CRITICAL DIRECTIVES:
1. ZERO DATA LOSS: You MUST NOT omit any data provided by the user. 
   - If the user lists multiple schools (Secondary, Higher Secondary, College, University), YOU MUST INCLUDE ALL OF THEM in the Education section.
   - Every role, project, and achievement provided must be preserved.
2. AGGRESSIVE PROFESSIONALIZATION: Transform EVERY sentence from the user into a high-impact, professional career statement.
   - Convert simple text like "I did x" into "Spearheaded the development of x using [Tech], resulting in [Outcome]."
   - Use the STAR (Situation, Task, Action, Result) method for all bullet points.
3. CODE-AWARE EXTRACTION:
   - Treat raw code as a primary data source. Extract the "What", "How", and "Result" from the logic.

CONSTRAINTS:
- One-column, ATS-safe format.
- NO raw code blocks.
- Output MUST be valid JSON.

OUTPUT STRUCTURE:
{
  "personalDetails": { 
    "firstName": "", "lastName": "", "email": "", "phone": "", "location": "",
    "links": [ { "label": "GitHub", "url": "..." } ]
  },
  "summary": "High-impact professional summary (30-60 words)",
  "experience": [ 
    { "id": "uuid", "company": "", "position": "", "location": "", "startDate": "", "endDate": "", "current": false, "description": "Professionalized bullet points separated by newlines..." } 
  ],
  "education": [ { "id": "uuid", "school": "", "degree": "", "field": "", "location": "", "graduationDate": "" } ],
  "skills": ["React", "TypeScript", "Node.js"],
  "certifications": [],
  "projects": [ { "id": "uuid", "name": "", "description": "Professionalized project description", "link": "" } ],
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

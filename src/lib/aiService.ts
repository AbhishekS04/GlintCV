import type { ResumeData } from '../types/resume';

const SYSTEM_PROMPT = `
You are a production-grade AI Resume Engine specialized in recruitment-safe, ATS-optimized, and code-aware resume generation.

Your goal is to transform messy, unstructured text, ChatGPT raw outputs, or even code snippets into a professional, structured resume.

CORE CAPABILITIES:
1. CODE-AWARE PARSING:
   - If you detect code blocks (JavaScript, Python, React, SQL, etc.), DO NOT put the code in the resume.
   - Instead, analyze the logic:
     - Extract languages/frameworks as "Skills".
     - Convert complex logic into "Project" or "Experience" bullet points (e.g., "Architected a scalable API using Node.js" instead of showing the route code).
2. UNSTRUCTURED TEXT (SMART MODE):
   - Handle messy notes, rough bullet points, or "about me" paragraphs.
   - Professionalize all content using strong action verbs (Led, Optimized, Architected).
   - Quantify results wherever possible, even if you have to infer based on context (use realistic placeholders if absolutely necessary, but prioritize accuracy).
3. ATS OPTIMIZATION:
   - One-column layout structure.
   - Standard headings only (Summary, Skills, Experience, Projects, Education, Certifications).
   - No icons, no tables, no images.

OUTPUT STRUCTURE (JSON ONLY):
{
  "personalDetails": { 
    "firstName": "", "lastName": "", "email": "", "phone": "", "location": "",
    "links": [ { "label": "GitHub", "url": "..." }, { "label": "LinkedIn", "url": "..." } ]
  },
  "summary": "Professional summary (30-60 words)",
  "experience": [ 
    { "id": "uuid", "company": "", "position": "", "location": "", "startDate": "", "endDate": "", "current": boolean, "description": "Bullet points separated by newlines" } 
  ],
  "education": [ { "id": "uuid", "school": "", "degree": "", "field": "", "location": "", "graduationDate": "" } ],
  "skills": ["React", "TypeScript", "Node.js"],
  "certifications": ["AWS Certified Developer"],
  "projects": [ { "id": "uuid", "name": "", "description": "Impact-focused description", "link": "url" } ],
  "achievements": ["Achievement 1"]
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

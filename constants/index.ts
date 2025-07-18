// This interface is for your application's type safety. It is NOT given to the AI.
export interface Feedback {
    overallScore: number;
    ATS: {
        score: number;
        tips: { type: "good" | "improve"; tip: string; explanation?: string }[];
    };
    toneAndStyle: {
        score: number;
        tips: { type: "good" | "improve"; tip: string; explanation: string }[];
    };
    content: {
        score: number;
        tips: { type: "good" | "improve"; tip: string; explanation: string }[];
    };
    structure: {
        score: number;
        tips: { type: "good" | "improve"; tip: string; explanation: string }[];
    };
    skills: {
        score: number;
        tips: { type: "good" | "improve"; tip: string; explanation: string }[];
    };
}

// This defines the structure for the placeholder data below.
export interface Resume {
    id: string;
    companyName: string;
    jobTitle: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback; // Uses the Feedback interface for type safety
}

// This placeholder data can be kept for UI mockups or other features.
// It is separate from the AI interaction logic.
export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume-1.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume-2.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    // Add other resume objects if needed...
];


// --- The Core Fix Starts Here ---

// This is a clean, valid JSON string that shows the AI exactly what to produce.
// This is far more reliable than giving it a TypeScript interface.
export const JSON_EXAMPLE_FORMAT = `{
  "overallScore": 85,
  "ATS": {
    "score": 90,
    "tips": [
      { "type": "good", "tip": "Well-formatted for parsers" },
      { "type": "improve", "tip": "Include more keywords from the job description" }
    ]
  },
  "toneAndStyle": {
    "score": 80,
    "tips": [
      { "type": "good", "tip": "Professional Tone", "explanation": "The tone is professional and suitable for the role." },
      { "type": "improve", "tip": "Use More Action Verbs", "explanation": "Replace passive phrases with stronger action verbs to show more impact." }
    ]
  },
  "content": {
    "score": 75,
    "tips": [
      { "type": "improve", "tip": "Quantify Achievements", "explanation": "Instead of saying 'Managed projects', try 'Managed 5 projects, increasing efficiency by 15%." }
    ]
  },
  "structure": {
    "score": 95,
    "tips": [
      { "type": "good", "tip": "Clear and Logical", "explanation": "The resume is well-structured and easy to follow." }
    ]
  },
  "skills": {
    "score": 80,
    "tips": [
      { "type": "improve", "tip": "Match Skills to Job", "explanation": "Tailor the skills section to better match the key technologies listed in the job description." }
    ]
  }
}`;


// The updated instructions are more forceful and use the clean JSON example.
// The function signature is now simpler and no longer needs the old AIResponseFormat string.
export const prepareInstructions = ({
                                        jobTitle,
                                        jobDescription
                                    }: {
    jobTitle: string;
    jobDescription: string;
}) =>
    `You are an expert resume analyst. Analyze the provided resume based on the job title and description.
Provide a detailed, critical review with scores and actionable tips. Be strict with scoring to provide the most value.

The job title is: ${jobTitle}
The job description is: "${jobDescription}"

You MUST respond with a JSON object that follows this exact structure and format:
${JSON_EXAMPLE_FORMAT}

Your response MUST be ONLY the raw JSON object, starting with { and ending with }.
Do NOT include the word "json", markdown backticks, or any other text, comments, or explanations before or after the JSON object.`;
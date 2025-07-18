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
  "overallScore": [SCORE_BETWEEN_0_100],
  "ATS": {
    "score": [SCORE_BETWEEN_0_100],
    "tips": [
      { "type": "good", "tip": "[DESCRIBE_WHAT_RESUME_DOES_WELL_FOR_ATS]" },
      { "type": "improve", "tip": "[SUGGEST_SPECIFIC_ATS_IMPROVEMENTS]" }
    ]
  },
  "toneAndStyle": {
    "score": [SCORE_BETWEEN_0_100],
    "tips": [
      { "type": "good", "tip": "[DESCRIBE_GOOD_TONE_OR_STYLE]", "explanation": "[EXPLAIN_WHY_THIS_TONE_STYLE_IS_EFFECTIVE]" },
      { "type": "improve", "tip": "[SUGGEST_TONE_STYLE_IMPROVEMENTS]", "explanation": "[EXPLAIN_HOW_TO_IMPROVE_TONE_STYLE]" }
    ]
  },
  "content": {
    "score": [SCORE_BETWEEN_0_100],
    "tips": [
      { "type": "improve", "tip": "[SUGGEST_CONTENT_IMPROVEMENTS]", "explanation": "[EXPLAIN_HOW_TO_IMPROVE_CONTENT]" }
    ]
  },
  "structure": {
    "score": [SCORE_BETWEEN_0_100],
    "tips": [
      { "type": "good", "tip": "[DESCRIBE_GOOD_STRUCTURE]", "explanation": "[EXPLAIN_WHY_STRUCTURE_IS_EFFECTIVE]" }
    ]
  },
  "skills": {
    "score": [SCORE_BETWEEN_0_100],
    "tips": [
      { "type": "improve", "tip": "[SUGGEST_SKILLS_IMPROVEMENTS]", "explanation": "[EXPLAIN_HOW_TO_IMPROVE_SKILLS_SECTION]" }
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
    `You are an expert resume analyst. Analyze the provided resume PDF file based on the job title and description.
Provide a detailed, critical review with scores and actionable tips. Be strict with scoring to provide the most value.

IMPORTANT: Analyze the ACTUAL content of the uploaded resume file. Do NOT use placeholder or example content.

The job title is: ${jobTitle}
The job description is: "${jobDescription}"

You MUST respond with a JSON object that follows this exact structure and format:
${JSON_EXAMPLE_FORMAT}

Replace all placeholder text (like [SCORE_BETWEEN_0_100], [DESCRIBE_GOOD_TONE_OR_STYLE], etc.) with your actual analysis of the resume.You can add as many tips and write as much as you want to be as helpful as possible with each section of the resume. As long as it follows the format the system expects to recieve!

Your response MUST be ONLY the raw JSON object, starting with { and ending with }.
Do NOT include the word "json", markdown backticks, or any other text, comments, or explanations before or after the JSON object.`;
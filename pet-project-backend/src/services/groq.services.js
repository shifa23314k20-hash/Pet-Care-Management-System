import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const generateAIResponse = async (prompt) => {
    try {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is not configured");
        }

        if (!prompt || typeof prompt !== "string") {
            throw new Error("AI prompt is required");
        }

        const completion = await groq.chat.completions.create({
            model: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",

            messages: [
                {
                    role: "system",
                    content: `
You are PetCare AI, a helpful pet health and care assistant.

Keep responses SHORT, SIMPLE, and suitable for a mobile app.

Rules:
- Answer only what the user asks.
- For simple questions, answer in 1-3 short sentences.
- Avoid long explanations.
- Avoid unnecessary sections.
- Avoid repeating information.
- Use simple language.
- Use bullet points only when they make the answer clearer.
- For health-related questions, give a brief helpful response and recommend a veterinarian when appropriate.
- Never claim to provide a confirmed medical diagnosis.
`,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],

            temperature: 0.3,
            max_tokens: 300,
        });

        return completion.choices?.[0]?.message?.content?.trim() || "";

    } catch (error) {
        console.error("GROQ AI ERROR:", error);

        throw new Error(
            error?.error?.message ||
            error?.message ||
            "Failed to generate AI response"
        );
    }
};
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const generateAIResponse = async (prompt) => {
    try {

        const completion = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],

        });

        return completion.choices[0].message.content;

    } catch (error) {
        console.error(error);
        throw error;
    }
};
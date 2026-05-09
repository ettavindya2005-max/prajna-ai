import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export const generateSummaryAndTasks = async (transcript: string) => {
  try {
    const prompt = `
    You are an AI assistant analyzing a meeting transcript.
    Please extract a concise summary of the meeting, and a list of all actionable tasks mentioned.
    Format the response strictly as a JSON object with two properties:
    - "summary": A string containing the meeting summary.
    - "tasks": An array of objects, where each object has:
      - "description": The task description.
      - "assignee": The person assigned to the task (or "Unassigned" if not mentioned).
      - "deadline": The deadline for the task (or null if not mentioned).

    Transcript:
    ${transcript}
    `;

    const response = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from Groq API");

    // Extract JSON using regex in case the AI added conversational text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON format. Raw output: " + content);
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Ensure the expected properties exist
      if (!parsed.summary) parsed.summary = "No summary generated.";
      if (!parsed.tasks || !Array.isArray(parsed.tasks)) parsed.tasks = [];
      
      return parsed;
    } catch (parseError) {
      throw new Error("Failed to parse AI JSON. Output: " + jsonMatch[0]);
    }
  } catch (error: any) {
    console.error("================ OPENAI ERROR ================");
    console.error(error.response?.data || error.message);
    console.error("==============================================");
    throw error;
  }
};

export const answerQuestion = async (question: string, context: string) => {
    try {
      const prompt = `
      You are an AI assistant for a meeting task manager.
      Use the provided context (which is a JSON string of recent tasks and meeting summaries) to answer the user's question.
      If the answer is not in the context, say you don't know based on the available data.
  
      Context:
      ${context}
  
      Question:
      ${question}
      `;
  
      const response = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
      });
  
      return response.choices[0].message.content;
    } catch (error: any) {
      console.error("================ OPENAI CHAT ERROR ================");
      console.error(error.response?.data || error.message);
      console.error("===================================================");
      throw error;
    }
  };

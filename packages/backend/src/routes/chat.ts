import { Router } from "express";
import openai from "../openai";

const chat = Router();

chat.get("/", async (req, res) => {
  const message = req.query?.message;
  if (!message) {
    res.json({ error: "message not found" });
    return;
  }

  openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "",
      },
    ],
    functions: [
      {
        name: "get_current_weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["location"],
        },
      },
    ],
    function_call: 'auto',
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  res.json(message);
});

export default chat;

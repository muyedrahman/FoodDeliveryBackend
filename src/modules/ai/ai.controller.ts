// import { Request, Response } from "express";
// import Anthropic from "@anthropic-ai/sdk";

// let anthropic: Anthropic | null = null;

// function getAnthropicClient(): Anthropic {
//   if (!anthropic) {
//     anthropic = new Anthropic({
//       apiKey: process.env.ANTHROPIC_API_KEY,
//     });
//   }
//   return anthropic;
// }

// // import { Request, Response } from "express";
// // import Anthropic from "@anthropic-ai/sdk";

// // const anthropic = new Anthropic({
// //   apiKey: process.env.ANTHROPIC_API_KEY,
// // });

// const SYSTEM_PROMPT = `You are FoodieAI's helpful food ordering assistant.
// You help customers find food based on their budget, cravings, and dietary preferences.
// Keep responses concise (2-4 sentences), friendly, and food-focused.
// Available categories: Burger, Pizza, Rice, Drinks, Dessert, Chicken.
// Prices range from $1.99 to $9.99.`;

// export async function chatWithAssistant(req: Request, res: Response) {
//   try {
//     const { message, history } = req.body;

//     if (!message || typeof message !== "string") {
//       return res.status(400).json({ error: "Message is required" });
//     }

//     const conversationHistory = Array.isArray(history) ? history : [];

//     const response = await anthropic.messages.create({
//       model: "claude-sonnet-4-6",
//       max_tokens: 300,
//       system: SYSTEM_PROMPT,
//       messages: [...conversationHistory, { role: "user", content: message }],
//     });

//     const textContent = response.content.find((block) => block.type === "text");

//     res.status(200).json({
//       reply:
//         textContent && "text" in textContent
//           ? textContent.text
//           : "Sorry, I couldn't generate a response.",
//     });
//   } catch (error) {
//     console.error("AI chat error:", error);
//     res.status(500).json({ error: "AI assistant is temporarily unavailable" });
//   }
// }

// export async function generateFoodDescription(req: Request, res: Response) {
//   try {
//     const { foodName, category, ingredients } = req.body;

//     if (!foodName) {
//       return res.status(400).json({ error: "foodName is required" });
//     }

//     const prompt = `Write a short, appetizing 2-sentence menu description for a dish called "${foodName}"${
//       category ? ` (category: ${category})` : ""
//     }${ingredients ? ` with these ingredients: ${ingredients}` : ""}.
// Only return the description text, nothing else.`;

//     const response = await anthropic.messages.create({
//       model: "claude-sonnet-4-6",
//       max_tokens: 150,
//       messages: [{ role: "user", content: prompt }],
//     });

//     const textContent = response.content.find((block) => block.type === "text");

//     res.status(200).json({
//       description: textContent && "text" in textContent ? textContent.text : "",
//     });
//   } catch (error) {
//     console.error("AI description generation error:", error);
//     res.status(500).json({ error: "Failed to generate description" });
//   }
// }

// 2

import { Request, Response } from "express";
import Anthropic from "@anthropic-ai/sdk";

let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

const SYSTEM_PROMPT = `You are FoodieAI's helpful food ordering assistant. 
You help customers find food based on their budget, cravings, and dietary preferences. 
Keep responses concise (2-4 sentences), friendly, and food-focused. 
Available categories: Burger, Pizza, Rice, Drinks, Dessert, Chicken. 
Prices range from $1.99 to $9.99.`;

export async function chatWithAssistant(req: Request, res: Response) {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const conversationHistory = Array.isArray(history) ? history : [];
    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [...conversationHistory, { role: "user", content: message }],
    });

    const textContent = response.content.find((block) => block.type === "text");

    res.status(200).json({
      reply:
        textContent && "text" in textContent
          ? textContent.text
          : "Sorry, I couldn't generate a response.",
    });
  } catch (error) {
    console.error("AI chat error:", error);
    res.status(500).json({ error: "AI assistant is temporarily unavailable" });
  }
}

export async function generateFoodDescription(req: Request, res: Response) {
  try {
    const { foodName, category, ingredients } = req.body;

    if (!foodName) {
      return res.status(400).json({ error: "foodName is required" });
    }

    const prompt = `Write a short, appetizing 2-sentence menu description for a dish called "${foodName}"${
      category ? ` (category: ${category})` : ""
    }${ingredients ? ` with these ingredients: ${ingredients}` : ""}. 
Only return the description text, nothing else.`;

    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 150,
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = response.content.find((block) => block.type === "text");

    res.status(200).json({
      description: textContent && "text" in textContent ? textContent.text : "",
    });
  } catch (error) {
    console.error("AI description generation error:", error);
    res.status(500).json({ error: "Failed to generate description" });
  }
}
import OpenAI from "openai";
import axios from "axios";
import { Environment } from "./Environment";
import MEMBERS_API_SCHEMA from "../../tools/schemas/apiSchema";

export class OpenAiHelper {
  private static openai: OpenAI | null = null;
  private static provider: string = Environment.aiProvider || "openrouter";
  private static OPENAI_API_KEY = Environment.openAiApiKey || "";
  private static OPENROUTER_API_KEY = Environment.openRouterApiKey || "";

  public static async initialize() {
    if (this.provider === "openai") {
      if (!this.OPENAI_API_KEY) {
        throw new Error("Missing ApiKey for OpenAi provider.");
      }
      if (!this.openai) {
        this.openai = new OpenAI({ apiKey: this.OPENAI_API_KEY });
      }
    }

    if (this.provider === "openrouter" && !this.OPENROUTER_API_KEY) {
      throw new Error("Missing ApiKey for OpenRouter provider.");
    }

    return this.openai;
  }

  public static async getCompletion(prompt: string, subDomain?: string, siteUrl?: string) {
    if (this.provider === "openai") {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an API assistant for a church membership system."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return this.parseAIResponse(response.choices[0]?.message?.content || "");
    }

    if (this.provider === "openrouter") {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "tngtech/deepseek-r1t2-chimera:free",
          messages: [
            {
              role: "system",
              content: "You are an API assistant for a church membership system."
            },
            { role: "user", content: prompt }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${this.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": siteUrl,
            "X-Title": subDomain
          }
        }
      );

      return this.parseAIResponse(response.data.choices[0]?.message?.content || "");
    }

    throw new Error(`Unsupported provider: ${this.provider}`);
  }

  public static buildPrompt(query: string) {
    return `
    You are an API assistant for a church membership system. 
    Convert the user's natural language query into API parameters.

    Available API Endpoints:
    ${JSON.stringify(MEMBERS_API_SCHEMA, null, 2)}

    Available parameters:
    - gender (male, female, unspecified)
    - birthDate (format: DD-MM-YYYY)
    - birthMonth (1-12)
    - age (numbers)
    - firstName (string)
    - middleName (string)
    - lastName (string)
    - nickName (string)
    - maritalStatus (single, married, divorced, widowed, unknown)
    - anniversary (format: DD-MM-YYYY)
    - anniversaryMonth (1-12)
    - yearsMarried (numbers)
    - membershipStatus (visitor, regularAttendee, member, staff, inactive)
    - email (string)
    - city (string)
    - state (string)
    - zip (string)
    - homePhone (string)
    - workPhone (string)
    - cellPhone (string)

    Available Operators:
    - equals
    - startsWith
    - endsWith
    - contains
    - greaterThan
    - greaterThanEqual
    - lessThan
    - lessThanEqual
    - notEqual

    Query: "${query}"

    Respond ONLY with JSON like:
    [
        { "field": "gender", "value": "male", "operator": "equals" },
        { "field": "birthMonth", "value": "7", "operator": "equal" },
        { "field": "age", "value": "30", "operator": "greaterThan" }
    ]
    `;
    // User Query: "${query}"
    // Respond ONLY with a JSON object containing:
    // {
    //     "endpoint": "/people",
    //     "params": {
    //         //extracted parameters
    //     }
    // }
  }

  private static parseAIResponse(responseText: string) {
    try {
      const jsonStart = responseText.indexOf("[");
      const jsonEnd = responseText.lastIndexOf("]") + 1;
      const jsonStr = responseText.slice(jsonStart, jsonEnd);
      return JSON.parse(jsonStr);
    } catch (error) {
      throw new Error("Failed to interpret the query results: " + error);
    }
  }
}

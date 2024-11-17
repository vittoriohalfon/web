import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Perplexity API
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

// Set up Prompt for Perplexity API
const prompts = [
  "Find the official company name associated with the given domain. Use this domain as a starting point, but search widely across the internet for the most accurate and up-to-date information. Provide ONLY the full, official name without additional details.",
  "Determine the specific industry or sector of the given company. Use their domain as a starting point, but conduct a comprehensive search across various sources to gather accurate information. Provide a CONCISE description of the industry/sector and explain the company's fit within it.",
  "Provide a VERY CONCISE overview of the company associated with the given domain. Use the domain as a starting point, but gather information from a wide range of sources. Include relevant info about their operations.",
  "BRIEFLY describe core products and services offered by the company associated with the given domain. Use the domain as a starting point, but conduct research across more sources. Provide a CONCISE and specific description of major offerings",
  "Identify the Unique Selling Proposition (USP) of the company associated with the given domain. Use the domain as a starting point, but analyze information from more sources. Keep it CONCISE and specific.",
  "Investigate and report on the Research and Development (R&D) activities of the company associated with the given domain. Use the domain as a starting point, but gather information from a wide range of sources including. Keep it CONCISE, and if you do not find anything related to R&D, respond: 'No information found on R&D activities.'",
  "Identify the target audience of the company associated with the given domain. Use the domain as a starting point, but gather info from various sources. Provide info about demographics, industries, or specific groups the company aims to serve. Make sure to keep it CONCISE and specific.",
  "Identify the top 2-5 key clients and/or strategic partners of the company associated with the given domain. Use the domain as a starting point, but research various sources. Provide a concise list of notable customers or collaborators, briefly mentioning how each relationship contributes to the company's success. Limit your response to 2-3 sentences."
];


// Function to send Prompt to Perplexity API
async function sendPromptToPerplexity(domain: string, prompt: string) {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          { role: "system", content: "You are a helpful assistant, who replies in a CONCISE manner. Reply directly, without the need to say 'Here is the information you requested' or 'Based on the the website' or ANYTHING like that." },
          { role: "user", content: `Here is the domain: ${domain}, ${prompt}` }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });
  
    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }
  
    const data = await response.json();
    return { prompt, answer: data.choices[0].message.content };
  }

  export { prompts, sendPromptToPerplexity };
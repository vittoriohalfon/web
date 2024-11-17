import { config } from 'dotenv';
import { resolve } from 'path';

// Initialize environment variables if running directly
if (typeof window === 'undefined') {
  config({ path: resolve(process.cwd(), '.env.local') });
}

// API Constants
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Enhanced prompts array with more comprehensive queries
const prompts = [
  "Find the official company name associated with the given domain. Use this domain as a starting point, but search widely across the internet for the most accurate and up-to-date information. Provide ONLY the full, official name without additional details.",
  "Determine the specific industry or sector of the given company. Use their domain as a starting point, but conduct a comprehensive search across various sources to gather accurate information. Provide a CONCISE description of the industry/sector and explain the company's fit within it.",
  "Provide a VERY CONCISE overview of the company associated with the given domain. Use the domain as a starting point, but gather information from a wide range of sources. Include relevant info about their operations.",
  "BRIEFLY describe core products and services offered by the company associated with the given domain. Use the domain as a starting point, but conduct research across more sources. Provide a CONCISE and specific description of major offerings",
  "Identify the Unique Selling Proposition (USP) of the company associated with the given domain. Use the domain as a starting point, but analyze information from more sources. Keep it CONCISE and specific.",
  "Investigate and report on the Research and Development (R&D) activities of the company associated with the given domain. Use the domain as a starting point, but gather information from a wide range of sources. Keep it CONCISE, and if you do not find anything related to R&D, respond: 'No information found on R&D activities.'",
  "Identify the target audience of the company associated with the given domain. Use the domain as a starting point, but gather info from various sources. Provide info about demographics, industries, or specific groups the company aims to serve. Make sure to keep it CONCISE and specific.",
  "Identify the top 2-5 key clients and/or strategic partners of the company associated with the given domain. Use the domain as a starting point, but research various sources. Provide a concise list of notable customers or collaborators, briefly mentioning how each relationship contributes to the company's success. Limit your response to 2-3 sentences."
];

// Add these constants at the top with other constants
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;

// Helper function for timeout
function timeout(ms: number) {
  return new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timed out')), ms)
  );
}

// Add these type imports at the top of the file
type PerplexityResponse = {
  choices: Array<{
    message: {
      content: string
    }
  }>
};

type OpenAIResponse = {
  choices: Array<{
    message: {
      content: string
    }
  }>
};

// Updated function to send Prompt to Perplexity API with retry logic
async function sendPromptToPerplexity(
  domain: string, 
  prompt: string, 
  retryCount = 0
): Promise<{ prompt: string; answer: string }> {
  try {
    const response = await Promise.race([
      fetch(PERPLEXITY_API_URL, {
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
      }),
      timeout(API_TIMEOUT)
    ]) as Response;

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as PerplexityResponse;
    return { prompt, answer: data.choices[0].message.content };
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      return sendPromptToPerplexity(domain, prompt, retryCount + 1);
    }
    throw error;
  }
}

// Updated function to structure response using OpenAI with retry logic
async function structureWithOpenAI(
  perplexityResponse: string, 
  fieldType: string, 
  retryCount = 0
): Promise<string> {
  try {
    const response = await Promise.race([
      fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a text cleaning assistant. Your task is to clean and format the input text for a company profile app. 
              
Rules:
- Remove any introductory phrases like "Here is..." or "Based on..."
- Remove any trailing descriptions or explanations
- Remove any meta-commentary about the data
- Keep only factual, relevant information
- Be concise but complete
- Do not add any type ofcommentary or additional context`
            },
            {
              role: "user",
              content: `Clean this text for ${fieldType}: ${perplexityResponse}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      }),
      timeout(API_TIMEOUT)
    ]) as Response;

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as OpenAIResponse;
    return data.choices[0].message.content;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      return structureWithOpenAI(perplexityResponse, fieldType, retryCount + 1);
    }
    throw error;
  }
}

// Main function to process domain information
async function processDomainInfo(domain: string) {
  // Verify API keys
  if (!PERPLEXITY_API_KEY || !OPENAI_API_KEY) {
    throw new Error('Missing API keys in environment variables');
  }

  // Create an array of promises for parallel Perplexity API calls
  const perplexityPromises = prompts.map(prompt => 
    sendPromptToPerplexity(domain, prompt)
      .catch(error => ({
        prompt,
        answer: `Error: ${error.message}`
      }))
  );

  // Wait for all Perplexity calls to complete
  const perplexityResults = await Promise.all(perplexityPromises);

  // Create an array of promises for parallel OpenAI API calls
  const structuringPromises = perplexityResults.map(result => 
    structureWithOpenAI(
      result.answer,
      result.prompt.split('.')[0]
    ).catch(error => `Error: ${error.message}`)
  );

  // Wait for all OpenAI calls to complete
  const structuredResults = await Promise.all(structuringPromises);

  // Combine results
  return perplexityResults.map((result, index) => ({
    fieldType: result.prompt.split('.')[0],
    content: structuredResults[index]
  }));
}

// Type definitions for the response
interface DomainInfoResult {
  fieldType: string;
  content: string;
}

export { 
  processDomainInfo,
  sendPromptToPerplexity,
  structureWithOpenAI,
  prompts,
  type DomainInfoResult
};
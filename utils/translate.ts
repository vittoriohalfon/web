const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

type OpenAIResponse = {
    choices: Array<{
        message: {
            content: string
        }
    }>
};

// Queue system to manage concurrent requests
class TranslationQueue {
    private queue: Array<() => Promise<void>> = [];
    private running = false;
    private concurrentLimit = 3; // Adjust this number based on your API limits
    private currentRunning = 0;

    async add<T>(task: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await task();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
            this.processQueue();
        });
    }

    private async processQueue() {
        if (this.running) return;
        this.running = true;

        while (this.queue.length > 0 && this.currentRunning < this.concurrentLimit) {
            const task = this.queue.shift();
            if (task) {
                this.currentRunning++;
                try {
                    await task();
                } catch (error) {
                    console.error('Task error:', error);
                }
                this.currentRunning--;
            }
        }

        this.running = false;
        if (this.queue.length > 0) {
            this.processQueue();
        }
    }
}

const translationQueue = new TranslationQueue();

// function to translate text from given language to english using OpenAI
async function translateWithOpenAI(text: string): Promise<string> {
    // If text is empty or already in English (you might want to add better English detection)
    if (!text?.trim()) {
        return text;
    }

    return translationQueue.add(async () => {
        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "system",
                            content: `You are a translation assistant. Your task is to translate the input text from the given language to English.
                            Rules:
                            - Keep the translation concise and to the point.
                            - Do not add any additional commentary or explanations.
                            - Do not add any type of commentary or additional context`
                        },
                        {
                            role: "user",
                            content: `Translate this text to English: ${text}. Please reply with only the translated text. Do not include any other text.`
                        }
                    ],
                    temperature: 0.1,
                    max_tokens: 1500
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
            }

            const data = (await response.json()) as OpenAIResponse;
            if (data.choices && data.choices.length > 0) {
                return data.choices[0].message.content;
            }
            throw new Error('No translation found in OpenAI response');
        } catch (error) {
            console.error('Translation Error:', error);
            return text; // Return original text if translation fails
        }
    });
}

export { translateWithOpenAI };
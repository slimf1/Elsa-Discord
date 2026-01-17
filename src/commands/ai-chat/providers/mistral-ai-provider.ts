import axios from "axios";
import { AIApiProvider, AIMessage } from "../ai-provider";

export abstract class MistralAIProvider implements AIApiProvider {
    abstract readonly model: string;
    async queryAI(messages: AIMessage[]): Promise<string> {
        if (!process.env.MISTRAL_API_KEY) {
            throw new Error('MISTRAL_API_KEY environment variable is not set');
        }
        
        const endpoint = 'https://api.mistral.ai/v1/chat/completions';
        const response = await axios.post(endpoint, {
            model: this.model,
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            temperature: 0.7,
            max_tokens: 2048
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
            }
        });

        const text = response.data.choices?.[0]?.message?.content;
        if (!text) {
            throw new Error('No valid response from Mistral AI API');
        }

        return text;
    }
}

export class MistralSmall2506 extends MistralAIProvider {
    readonly model = 'mistral-small-2506';
}

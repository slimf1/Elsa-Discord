import axios from 'axios';
import { AIApiProvider } from '../ai-provider';

export class GrokAIProvider implements AIApiProvider {
    readonly model = 'grok-4-latest';
    async queryAI(messages: import("../ai-provider").AIMessage[]): Promise<string> {
        const apiKey = process.env.GROK_API_KEY;
        
        if (!apiKey) {
            throw new Error('GROK_API_KEY environment variable is not set');
        }
        
        const endpoint = 'https://api.x.ai/v1/chat/completions';

        const response = await axios.post(endpoint, {
            messages,
            model: this.model,
            stream: false,
            temperature: 0
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        const text = response.data.choices?.[0]?.message?.content;
        if (!text) {
            throw new Error('No valid response from Grok AI API');
        }

        return text;
    }
}

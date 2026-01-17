import axios from 'axios';
import { AIApiProvider, AIMessage } from '../ai-provider';

export abstract class GeminiAIProvider implements AIApiProvider {
    abstract readonly model: string;
    async queryAI(messages: AIMessage[]): Promise<string> {
        const apiKey = process.env.GEMINI_API_KEY;
          
          if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
          }

          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
          const systemMessages = messages.filter(m => m.role === 'system');
          const conversationMessages = messages.filter(m => m.role !== 'system');
          const systemInstruction = systemMessages.length > 0
            ? { parts: [{ text: systemMessages.map(m => m.content).join('\n\n') }] }
            : undefined;
        
          const contents = conversationMessages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          }));
        
          const requestBody: any = {
            contents
          };
        
          if (systemInstruction) {
            requestBody.systemInstruction = systemInstruction;
          }
        
          const response = await axios.post(endpoint, requestBody, {
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey
            }
          });
        
          const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (!text) {
            throw new Error('No valid response from Gemini API');
          }
        
          return text;
    }
}

export class Gemini25FlashProvider extends GeminiAIProvider {
    readonly model = 'gemini-2.5-flash';
}

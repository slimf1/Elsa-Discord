import { Gemini25FlashProvider } from "./providers/gemini-ai-provider";
import { GrokAIProvider } from "./providers/grok-ai-provider";
import { MistralSmall2506 } from "./providers/mistral-ai-provider";

export const supportedAiProviders = new Map<string, AIApiProvider>();
supportedAiProviders.set('gemini-2.5-flash', new Gemini25FlashProvider());
supportedAiProviders.set('mistral-small-2506', new MistralSmall2506());
supportedAiProviders.set('grok', new GrokAIProvider()); // Ne fonctionne pas
export type AIMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

export type AIConversation = {
    messages: AIMessage[];
};

export interface AIApiProvider {
    queryAI(messages: AIMessage[]): Promise<string>;
}

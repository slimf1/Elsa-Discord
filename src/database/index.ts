import 'reflect-metadata';
import {DataSource, Repository} from 'typeorm';
import {CustomCommand} from './entity/custom-command';
import { ChatBotPersonality } from './entity/conversation-context';

export interface IBotRepository {
    getCustomCommands(guild: string): Promise<CustomCommand[]>;

    getCustomCommand(guild: string, name: string): Promise<CustomCommand | null>;

    createCustomCommand(guild: string, name: string, content: string): Promise<CustomCommand>;

    deleteCustomCommand(guild: string, name: string): Promise<boolean>;

    createChatBotPersonality(id: string, provider: string, systemPrompt: string): Promise<ChatBotPersonality>;

    getChatBotPersonality(id: string): Promise<ChatBotPersonality | null>;
}

// TODO : ne pas tout mettre dans un même repo
export class BotRepository implements IBotRepository {

    private readonly dataSource: DataSource;

    private customCommandRepository: Repository<CustomCommand> | null = null;
    private chatBotRepository: Repository<ChatBotPersonality> | null = null;

    constructor() {
        this.dataSource = new DataSource({
            type: 'sqlite',
            database: './database.sqlite',
            entities: [CustomCommand, ChatBotPersonality],
            synchronize: true,
            logging: process.env.LOG_DB === 'true',
        });
        this.dataSource.initialize().then(db => {
            this.customCommandRepository = db.getRepository(CustomCommand);
            this.chatBotRepository = db.getRepository(ChatBotPersonality);
        });
    }

    async createChatBotPersonality(id: string, provider: string, systemPrompt: string): Promise<ChatBotPersonality> {
        return this.chatBotRepository!.save(new ChatBotPersonality(id, systemPrompt, provider));
    }

    async getChatBotPersonality(id: string): Promise<ChatBotPersonality | null> {
        return this.chatBotRepository!.findOne({where: {id}});
    }

    async getCustomCommand(guild: string, name: string): Promise<CustomCommand | null> {
        return this.customCommandRepository!.findOne({where: {guild, name}});
    }

    async getCustomCommands(guild: string): Promise<CustomCommand[]> {
        return this.customCommandRepository!.find({where: {guild}});
    }

    async createCustomCommand(guild: string, name: string, content: string): Promise<CustomCommand> {
        return this.customCommandRepository!.save(new CustomCommand(name, guild, content));
    }

    async deleteCustomCommand(guild: string, name: string): Promise<boolean> {
        const deleteResult = await this.customCommandRepository!.delete({guild, name});
        return deleteResult.affected === 1;
    }
}

import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class ChatBotPersonality {
    constructor(id: string, systemPrompt: string, provider: string) {
        this.id = id;
        this.systemPrompt = systemPrompt;
        this.provider = provider;
    }

    @PrimaryColumn({type: 'text'}) id!: string;
    @Column({type: 'text'}) systemPrompt!: string;
    @Column({type: 'text'}) provider!: string;
}

import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class CustomCommand {
    constructor(name: string, guild: string, content: string) {
        this.name = name;
        this.guild = guild;
        this.content = content;
        this.createdAt = new Date();
    }

    @PrimaryColumn({type: 'text'}) name!: string;
    @PrimaryColumn({type: 'text'}) guild!: string;
    @Column({type: 'text'}) content!: string;
    @Column({type: 'date'}) createdAt!: Date;
}

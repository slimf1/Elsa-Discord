import {Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class TournamentDirector {
    constructor(id: string) {
        this.id = id;
    }
    @PrimaryColumn({type: 'text'}) id!: string;
}

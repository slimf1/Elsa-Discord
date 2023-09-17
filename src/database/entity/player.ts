import {Team} from './team';
import {Entity, ManyToOne, PrimaryColumn} from 'typeorm';

@Entity()
export class Player {
    @PrimaryColumn({type: 'text'}) id!: string;

    @ManyToOne(() => Team, (team) => team.players)
    team!: Team;

    constructor(playerID: string, team: Team) {
        this.id = playerID;
        this.team = team;
    }
}

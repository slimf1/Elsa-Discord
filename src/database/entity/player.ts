import {Team} from './team';
import {Entity, ManyToOne, PrimaryColumn} from 'typeorm';

@Entity()
export class Player {
    @PrimaryColumn({type: 'text'}) id!: string;

    @ManyToOne(() => Team, (team) => team.players)
    team!: Team;
}

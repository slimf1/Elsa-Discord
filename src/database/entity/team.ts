import {Column, Entity, OneToMany, PrimaryColumn} from 'typeorm';
import {Player} from './player';

@Entity()
export class Team {

    constructor(id: string, name: string, captainID: string) {
        this.id = id;
        this.name = name;
        this.captainID = captainID;
    }

    @PrimaryColumn({type: 'text'}) id!: string;
    @Column({type: 'text'}) name!: string;
    @Column({type: 'text'}) captainID!: string;

    @OneToMany(() => Player, (player) => player.team)
    players!: Player[];
}

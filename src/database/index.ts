import 'reflect-metadata';
import {DataSource, Repository} from 'typeorm';
import {CustomCommand} from './entity/custom-command';
import {TournamentDirector} from './entity/tournament-director';
import {Player} from './entity/player';
import {Team} from './entity/team';

export interface IBotRepository {
    getCustomCommands(guild: string): Promise<CustomCommand[]>;

    getCustomCommand(guild: string, name: string): Promise<CustomCommand | null>;

    createCustomCommand(guild: string, name: string, content: string): Promise<CustomCommand>;

    deleteCustomCommand(guild: string, name: string): Promise<boolean>;

    getTournamentDirector(id: string): Promise<TournamentDirector | null>;

    addTournamentDirector(id: string): Promise<TournamentDirector>;

    deleteTournamentDirector(id: string): Promise<boolean>;

    getTournamentDirectors(): Promise<TournamentDirector[]>;

    getTeam(id: string): Promise<Team | null>;

    getTeams(): Promise<Team[]>;

    addTeam(id: string, name: string, captainID: string): Promise<Team>;

    deleteTeam(id: string): Promise<boolean>;
}

export class BotRepository implements IBotRepository {

    private readonly dataSource: DataSource;

    private customCommandRepository: Repository<CustomCommand> | null = null;
    private tournamentDirectorRepository: Repository<TournamentDirector> | null = null;
    private teamRepository: Repository<Team> | null = null;
    private playerRepository: Repository<Player> | null = null;

    constructor() {
        this.dataSource = new DataSource({
            type: 'sqlite',
            database: './database.sqlite',
            entities: [CustomCommand, TournamentDirector, Player, Team],
            synchronize: true,
            logging: process.env.LOG_DB === 'true',
        });
        this.dataSource.initialize().then(db => {
            this.customCommandRepository = db.getRepository(CustomCommand);
            this.tournamentDirectorRepository = db.getRepository(TournamentDirector);
            this.teamRepository = db.getRepository(Team);
            this.playerRepository = db.getRepository(Player);
        });
    }

    getCustomCommand(guild: string, name: string): Promise<CustomCommand | null> {
        return this.customCommandRepository!.findOne({where: {guild, name}});
    }

    getCustomCommands(guild: string): Promise<CustomCommand[]> {
        return this.customCommandRepository!.find({where: {guild}});
    }

    createCustomCommand(guild: string, name: string, content: string): Promise<CustomCommand> {
        return this.customCommandRepository!.save(new CustomCommand(name, guild, content));
    }

    async deleteCustomCommand(guild: string, name: string): Promise<boolean> {
        const deleteResult = await this.customCommandRepository!.delete({guild, name});
        return deleteResult.affected === 1;
    }

    getTournamentDirector(id: string): Promise<TournamentDirector | null> {
        return this.tournamentDirectorRepository!.findOne({where: {id}});
    }

    addTournamentDirector(id: string): Promise<TournamentDirector> {
        return this.tournamentDirectorRepository!.save(new TournamentDirector(id));
    }

    async deleteTournamentDirector(id: string): Promise<boolean> {
        const deleteResult = await this.tournamentDirectorRepository!.delete({id});
        return deleteResult.affected === 1;
    }

    getTournamentDirectors(): Promise<TournamentDirector[]> {
        return this.tournamentDirectorRepository!.find();
    }

    addTeam(id: string, name: string, captainID: string): Promise<Team> {
        return this.teamRepository!.save(new Team(id, name, captainID));
    }

    async deleteTeam(id: string): Promise<boolean> {
        const deleteResult = await this.teamRepository!.delete({id});
        return deleteResult.affected === 1;
    }

    getTeam(id: string): Promise<Team | null> {
        return this.teamRepository!.findOne({where: {id}});
    }

    getTeams(): Promise<Team[]> {
        return this.teamRepository!.find();
    }
}

import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import { CustomCommand } from './entity/custom-command';

export interface IBotRepository {
  getCustomCommands(guild: string): Promise<CustomCommand[]>;
  getCustomCommand(guild: string, name: string): Promise<CustomCommand | null>;
  createCustomCommand(guild: string, name: string, content: string): Promise<CustomCommand>;
  deleteCustomCommand(guild: string, name: string): Promise<boolean>;
}

export class BotRepository implements IBotRepository {

  private readonly dataSource: DataSource;

  private customCommandRepository: Repository<CustomCommand> | null = null;

  constructor() {
    this.dataSource = new DataSource({
      type: 'sqlite',
      database: './database.sqlite',
      entities: [CustomCommand],
      synchronize: true,
      logging: process.env.LOG_DB === 'true',
    });
    this.dataSource.initialize().then(db =>
      this.customCommandRepository = db.getRepository(CustomCommand)
    );
  }

  async getCustomCommand(guild: string, name: string): Promise<CustomCommand | null> {
    return this.customCommandRepository!.findOne({ where: { guild, name } });
  }

  async getCustomCommands(guild: string): Promise<CustomCommand[]> {
    return this.customCommandRepository!.find({ where: { guild } });
  }

  async createCustomCommand(guild: string, name: string, content: string): Promise<CustomCommand> {
    return this.customCommandRepository!.save(new CustomCommand(name, guild, content));
  }

  async deleteCustomCommand(guild: string, name: string): Promise<boolean> {
    const deleteResult = await this.customCommandRepository!.delete({ guild, name });
    return deleteResult.affected === 1;
  }
}

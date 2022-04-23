import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import { CustomCommand } from './entity/custom-command';

export interface IBotRepository {
  initialize(): Promise<void>;
  getCustomCommands(guild: string): Promise<CustomCommand[]>;
  getCustomCommand(guild: string, name: string): Promise<CustomCommand | null>;
  createCustomCommand(guild: string, name: string, content: string): Promise<CustomCommand>;
  deleteCustomCommand(guild: string, name: string): Promise<boolean>;
}

export class BotRepository implements IBotRepository {

  private readonly dataSource: DataSource;

  private repository: Repository<CustomCommand> | null = null;

  constructor() {
    this.dataSource = new DataSource({
      type: 'sqlite',
      database: './database.sqlite',
      entities: [CustomCommand],
      synchronize: true,
      logging: process.env.LOG_DB === 'true',
    });
  }

  private assertInitialized(): void {
    if (this.repository === null) {
      throw new Error('Repository not initialized.');
    }
  }

  async initialize(): Promise<void> {
    const db = await this.dataSource.initialize();
    this.repository = db.getRepository(CustomCommand);
  }

  async getCustomCommand(guild: string, name: string): Promise<CustomCommand | null> {
    this.assertInitialized();
    return this.repository!.findOne({ where: { guild, name } });
  }

  async getCustomCommands(guild: string): Promise<CustomCommand[]> {
    this.assertInitialized();
    return this.repository!.find({ where: { guild } });
  }

  async createCustomCommand(guild: string, name: string, content: string): Promise<CustomCommand> {
    this.assertInitialized();
    return this.repository!.save(new CustomCommand(name, guild, content));
  }

  async deleteCustomCommand(guild: string, name: string): Promise<boolean> {
    this.assertInitialized();
    const deleteResult = await this.repository!.delete({ guild, name });
    return deleteResult.affected === 1;
  }
}

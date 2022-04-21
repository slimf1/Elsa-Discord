import { Sequelize } from 'sequelize';
import initializeDb from './init';
import { CustomCommand } from './models/custom-command';

export interface IRepository {
  init(): Promise<void>;
}

export class Repository implements IRepository {
  private readonly sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite',
    });
  }

  public async init() {
    initializeDb();
    await this.sequelize.authenticate();
    await this.sequelize.sync();
    CustomCommand.initialize(this.sequelize);
  }
}

const repository: IRepository = new Repository();

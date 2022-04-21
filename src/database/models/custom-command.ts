import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Optional,
  Sequelize
} from 'sequelize';

interface CustomCommandAttributes {
  id: number;
  guild: string;
  name: string;
  content: string;
  createdAt?: Date;
}

export type CustomCommandInput = Optional<CustomCommandAttributes, 'id'>

export class CustomCommand extends Model<CustomCommandAttributes, CustomCommandInput> {
  public id!: number;
  public guild!: string;
  public name!: string;
  public content!: string;
  public createdAt!: Date;

  static initialize(sequelize: Sequelize): void {
    CustomCommand.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      guild: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {
      sequelize: sequelize,
      modelName: 'custom-command',
    });
  }
}

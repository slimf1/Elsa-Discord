import { CustomCommand } from './models/custom-command';

export default function initializeDb() {
  CustomCommand.sync({ force: true });
}

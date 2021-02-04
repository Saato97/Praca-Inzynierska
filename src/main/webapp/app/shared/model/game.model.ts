import { ITournaments } from 'app/shared/model/tournaments.model';

export interface IGame {
  id?: number;
  name?: string;
  teamSize?: number;
  tournaments?: ITournaments[];
}

export class Game implements IGame {
  constructor(public id?: number, public name?: string, public teamSize?: number, public tournaments?: ITournaments[]) {}
}

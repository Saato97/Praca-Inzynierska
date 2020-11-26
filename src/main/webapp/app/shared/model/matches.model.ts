import { Moment } from 'moment';
import { ITournaments } from 'app/shared/model/tournaments.model';
import { ITeams } from 'app/shared/model/teams.model';

export interface IMatches {
  id?: number;
  startDate?: Moment;
  teamA?: number;
  teamB?: number;
  winner?: number;
  matchUrl?: string;
  tournaments?: ITournaments[];
  teams?: ITeams[];
}

export class Matches implements IMatches {
  constructor(
    public id?: number,
    public startDate?: Moment,
    public teamA?: number,
    public teamB?: number,
    public winner?: number,
    public matchUrl?: string,
    public tournaments?: ITournaments[],
    public teams?: ITeams[]
  ) {}
}

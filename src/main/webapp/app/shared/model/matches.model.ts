import { Moment } from 'moment';
import { ITeams } from 'app/shared/model/teams.model';
import { ITournaments } from 'app/shared/model/tournaments.model';

export interface IMatches {
  id?: number;
  startDate?: Moment;
  teamA?: number;
  teamB?: number;
  winner?: number;
  matchUrl?: string;
  teams?: ITeams[];
  tournaments?: ITournaments;
}

export class Matches implements IMatches {
  constructor(
    public id?: number,
    public startDate?: Moment,
    public teamA?: number,
    public teamB?: number,
    public winner?: number,
    public matchUrl?: string,
    public teams?: ITeams[],
    public tournaments?: ITournaments
  ) {}
}

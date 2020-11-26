import { Moment } from 'moment';
import { IOrganizers } from 'app/shared/model/organizers.model';
import { ITeams } from 'app/shared/model/teams.model';
import { IMatches } from 'app/shared/model/matches.model';
import { Games } from 'app/shared/model/enumerations/games.model';

export interface ITournaments {
  id?: number;
  name?: string;
  gameType?: Games;
  description?: any;
  maxParticipants?: number;
  currentParticipants?: number;
  startDate?: Moment;
  tournamentLogoContentType?: string;
  tournamentLogo?: any;
  organizers?: IOrganizers;
  teams?: ITeams;
  matches?: IMatches;
}

export class Tournaments implements ITournaments {
  constructor(
    public id?: number,
    public name?: string,
    public gameType?: Games,
    public description?: any,
    public maxParticipants?: number,
    public currentParticipants?: number,
    public startDate?: Moment,
    public tournamentLogoContentType?: string,
    public tournamentLogo?: any,
    public organizers?: IOrganizers,
    public teams?: ITeams,
    public matches?: IMatches
  ) {}
}

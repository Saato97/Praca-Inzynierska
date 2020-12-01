import { IApplicationUsers } from 'app/shared/model/application-users.model';
import { ITournaments } from 'app/shared/model/tournaments.model';
import { IMatches } from 'app/shared/model/matches.model';

export interface ITeams {
  id?: number;
  teamName?: string;
  captainName?: string;
  teamLogoContentType?: string;
  teamLogo?: any;
  applicationUsers?: IApplicationUsers[];
  tournaments?: ITournaments;
  matches?: IMatches;
}

export class Teams implements ITeams {
  constructor(
    public id?: number,
    public teamName?: string,
    public captainName?: string,
    public teamLogoContentType?: string,
    public teamLogo?: any,
    public applicationUsers?: IApplicationUsers[],
    public tournaments?: ITournaments,
    public matches?: IMatches
  ) {}
}

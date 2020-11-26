import { ITournaments } from 'app/shared/model/tournaments.model';
import { IApplicationUsers } from 'app/shared/model/application-users.model';
import { IMatches } from 'app/shared/model/matches.model';

export interface ITeams {
  id?: number;
  teamName?: string;
  captainName?: string;
  teamLogoContentType?: string;
  teamLogo?: any;
  tournaments?: ITournaments[];
  applicationUsers?: IApplicationUsers[];
  matches?: IMatches;
}

export class Teams implements ITeams {
  constructor(
    public id?: number,
    public teamName?: string,
    public captainName?: string,
    public teamLogoContentType?: string,
    public teamLogo?: any,
    public tournaments?: ITournaments[],
    public applicationUsers?: IApplicationUsers[],
    public matches?: IMatches
  ) {}
}

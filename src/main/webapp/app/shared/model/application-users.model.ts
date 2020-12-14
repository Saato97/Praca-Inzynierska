import { IUser } from 'app/core/user/user.model';
import { ITeams } from 'app/shared/model/teams.model';

export interface IApplicationUsers {
  id?: number;
  level?: number;
  points?: number;
  userLogoContentType?: string;
  userLogo?: any;
  username?: string;
  internalUser?: IUser;
  teams?: ITeams[];
}

export class ApplicationUsers implements IApplicationUsers {
  constructor(
    public id?: number,
    public level?: number,
    public points?: number,
    public userLogoContentType?: string,
    public userLogo?: any,
    public username?: string,
    public internalUser?: IUser,
    public teams?: ITeams[]
  ) {}
}

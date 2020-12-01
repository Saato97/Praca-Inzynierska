import { IApplicationUsers } from 'app/shared/model/application-users.model';
import { ITournaments } from 'app/shared/model/tournaments.model';

export interface IOrganizers {
  id?: number;
  email?: string;
  discord?: string;
  applicationUsers?: IApplicationUsers;
  tournaments?: ITournaments[];
}

export class Organizers implements IOrganizers {
  constructor(
    public id?: number,
    public email?: string,
    public discord?: string,
    public applicationUsers?: IApplicationUsers,
    public tournaments?: ITournaments[]
  ) {}
}

import { IApplicationUsers } from 'app/shared/model/application-users.model';

export interface IOrganizers {
  id?: number;
  email?: string;
  discord?: string;
  applicationUsers?: IApplicationUsers;
}

export class Organizers implements IOrganizers {
  constructor(public id?: number, public email?: string, public discord?: string, public applicationUsers?: IApplicationUsers) {}
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ITeams } from 'app/shared/model/teams.model';

type EntityResponseType = HttpResponse<ITeams>;
type EntityArrayResponseType = HttpResponse<ITeams[]>;

@Injectable({ providedIn: 'root' })
export class TeamsService {
  public resourceUrl = SERVER_API_URL + 'api/teams';

  constructor(protected http: HttpClient) {}

  create(teams: ITeams): Observable<EntityResponseType> {
    return this.http.post<ITeams>(this.resourceUrl, teams, { observe: 'response' });
  }

  update(teams: ITeams): Observable<EntityResponseType> {
    return this.http.put<ITeams>(this.resourceUrl, teams, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITeams>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITeams[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  findTournamentTeams(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITeams[]>(this.resourceUrl + '/tournament', { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

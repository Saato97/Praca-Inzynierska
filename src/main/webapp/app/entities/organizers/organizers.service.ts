import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IOrganizers } from 'app/shared/model/organizers.model';

type EntityResponseType = HttpResponse<IOrganizers>;
type EntityArrayResponseType = HttpResponse<IOrganizers[]>;

@Injectable({ providedIn: 'root' })
export class OrganizersService {
  public resourceUrl = SERVER_API_URL + 'api/organizers';

  constructor(protected http: HttpClient) {}

  create(organizers: IOrganizers): Observable<EntityResponseType> {
    return this.http.post<IOrganizers>(this.resourceUrl, organizers, { observe: 'response' });
  }

  update(organizers: IOrganizers): Observable<EntityResponseType> {
    return this.http.put<IOrganizers>(this.resourceUrl, organizers, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrganizers>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrganizers[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

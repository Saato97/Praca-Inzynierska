import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IMatches } from 'app/shared/model/matches.model';

type EntityResponseType = HttpResponse<IMatches>;
type EntityArrayResponseType = HttpResponse<IMatches[]>;

@Injectable({ providedIn: 'root' })
export class MatchesService {
  public resourceUrl = SERVER_API_URL + 'api/matches';

  constructor(protected http: HttpClient) {}

  create(matches: IMatches): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(matches);
    return this.http
      .post<IMatches>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(matches: IMatches): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(matches);
    return this.http
      .put<IMatches>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMatches>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMatches[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(matches: IMatches): IMatches {
    const copy: IMatches = Object.assign({}, matches, {
      startDate: matches.startDate && matches.startDate.isValid() ? matches.startDate.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? moment(res.body.startDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((matches: IMatches) => {
        matches.startDate = matches.startDate ? moment(matches.startDate) : undefined;
      });
    }
    return res;
  }
}

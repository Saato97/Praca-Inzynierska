import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ITournaments } from 'app/shared/model/tournaments.model';

type EntityResponseType = HttpResponse<ITournaments>;
type EntityArrayResponseType = HttpResponse<ITournaments[]>;

@Injectable({ providedIn: 'root' })
export class TournamentsService {
  public resourceUrl = SERVER_API_URL + 'api/tournaments';

  constructor(protected http: HttpClient) {}

  create(tournaments: ITournaments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tournaments);
    return this.http
      .post<ITournaments>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(tournaments: ITournaments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tournaments);
    return this.http
      .put<ITournaments>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITournaments>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITournaments[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(tournaments: ITournaments): ITournaments {
    const copy: ITournaments = Object.assign({}, tournaments, {
      startDate: tournaments.startDate && tournaments.startDate.isValid() ? tournaments.startDate.toJSON() : undefined,
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
      res.body.forEach((tournaments: ITournaments) => {
        tournaments.startDate = tournaments.startDate ? moment(tournaments.startDate) : undefined;
      });
    }
    return res;
  }
}

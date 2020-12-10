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
export class UserProfileService {
  public resourceUrl = SERVER_API_URL + 'api/user-profile';

  constructor(protected http: HttpClient) {}

  myMatches(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMatches[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
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

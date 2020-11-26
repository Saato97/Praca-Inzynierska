import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IMatches, Matches } from 'app/shared/model/matches.model';
import { MatchesService } from './matches.service';
import { MatchesComponent } from './matches.component';
import { MatchesDetailComponent } from './matches-detail.component';
import { MatchesUpdateComponent } from './matches-update.component';

@Injectable({ providedIn: 'root' })
export class MatchesResolve implements Resolve<IMatches> {
  constructor(private service: MatchesService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMatches> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((matches: HttpResponse<Matches>) => {
          if (matches.body) {
            return of(matches.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Matches());
  }
}

export const matchesRoute: Routes = [
  {
    path: '',
    component: MatchesComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.matches.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MatchesDetailComponent,
    resolve: {
      matches: MatchesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.matches.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MatchesUpdateComponent,
    resolve: {
      matches: MatchesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.matches.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MatchesUpdateComponent,
    resolve: {
      matches: MatchesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.matches.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

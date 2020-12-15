import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ITeams, Teams } from 'app/shared/model/teams.model';
import { TeamsService } from './teams.service';
import { TeamsComponent } from './teams.component';
import { TeamsDetailComponent } from './teams-detail.component';
import { TeamsUpdateComponent } from './teams-update.component';

@Injectable({ providedIn: 'root' })
export class TeamsResolve implements Resolve<ITeams> {
  constructor(private service: TeamsService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITeams> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((teams: HttpResponse<Teams>) => {
          if (teams.body) {
            return of(teams.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Teams());
  }
}

export const teamsRoute: Routes = [
  {
    path: '',
    component: TeamsComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.teams.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TeamsDetailComponent,
    resolve: {
      teams: TeamsResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.teams.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TeamsUpdateComponent,
    resolve: {
      teams: TeamsResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.teams.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TeamsUpdateComponent,
    resolve: {
      teams: TeamsResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'esportsApp.teams.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

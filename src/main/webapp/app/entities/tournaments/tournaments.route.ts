import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ITournaments, Tournaments } from 'app/shared/model/tournaments.model';
import { TournamentsService } from './tournaments.service';
import { TournamentsComponent } from './tournaments.component';
import { TournamentsDetailComponent } from './tournaments-detail.component';
import { TournamentsUpdateComponent } from './tournaments-update.component';

@Injectable({ providedIn: 'root' })
export class TournamentsResolve implements Resolve<ITournaments> {
  constructor(private service: TournamentsService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITournaments> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((tournaments: HttpResponse<Tournaments>) => {
          if (tournaments.body) {
            return of(tournaments.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Tournaments());
  }
}

export const tournamentsRoute: Routes = [
  {
    path: '',
    component: TournamentsComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.tournaments.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TournamentsDetailComponent,
    resolve: {
      tournaments: TournamentsResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.tournaments.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TournamentsUpdateComponent,
    resolve: {
      tournaments: TournamentsResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.tournaments.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TournamentsUpdateComponent,
    resolve: {
      tournaments: TournamentsResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.tournaments.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

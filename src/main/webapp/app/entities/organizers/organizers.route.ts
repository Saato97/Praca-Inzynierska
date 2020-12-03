import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IOrganizers, Organizers } from 'app/shared/model/organizers.model';
import { OrganizersService } from './organizers.service';
import { OrganizersComponent } from './organizers.component';
import { OrganizersDetailComponent } from './organizers-detail.component';
import { OrganizersUpdateComponent } from './organizers-update.component';

@Injectable({ providedIn: 'root' })
export class OrganizersResolve implements Resolve<IOrganizers> {
  constructor(private service: OrganizersService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrganizers> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((organizers: HttpResponse<Organizers>) => {
          if (organizers.body) {
            return of(organizers.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Organizers());
  }
}

export const organizersRoute: Routes = [
  {
    path: '',
    component: OrganizersComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'esportsApp.organizers.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizersDetailComponent,
    resolve: {
      organizers: OrganizersResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'esportsApp.organizers.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizersUpdateComponent,
    resolve: {
      organizers: OrganizersResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'esportsApp.organizers.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizersUpdateComponent,
    resolve: {
      organizers: OrganizersResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'esportsApp.organizers.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

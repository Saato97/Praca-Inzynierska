import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IApplicationUsers, ApplicationUsers } from 'app/shared/model/application-users.model';
import { ApplicationUsersService } from './application-users.service';
import { ApplicationUsersComponent } from './application-users.component';
import { ApplicationUsersDetailComponent } from './application-users-detail.component';
import { ApplicationUsersUpdateComponent } from './application-users-update.component';

@Injectable({ providedIn: 'root' })
export class ApplicationUsersResolve implements Resolve<IApplicationUsers> {
  constructor(private service: ApplicationUsersService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IApplicationUsers> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((applicationUsers: HttpResponse<ApplicationUsers>) => {
          if (applicationUsers.body) {
            return of(applicationUsers.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ApplicationUsers());
  }
}

export const applicationUsersRoute: Routes = [
  {
    path: '',
    component: ApplicationUsersComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.applicationUsers.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ApplicationUsersDetailComponent,
    resolve: {
      applicationUsers: ApplicationUsersResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.applicationUsers.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ApplicationUsersUpdateComponent,
    resolve: {
      applicationUsers: ApplicationUsersResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.applicationUsers.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ApplicationUsersUpdateComponent,
    resolve: {
      applicationUsers: ApplicationUsersResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'esportsApp.applicationUsers.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

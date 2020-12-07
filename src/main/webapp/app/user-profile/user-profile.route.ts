import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Authority } from 'app/shared/constants/authority.constants';
import { UserProfileComponent } from './user-profile.component';

export const USER_PROFILE_ROUTE: Route = {
  path: 'user-profile',
  component: UserProfileComponent,
  data: {
    authorities: [Authority.USER],
    pageTitle: 'user-profile.title',
  },
  canActivate: [UserRouteAccessService],
};

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'application-users',
        loadChildren: () => import('./application-users/application-users.module').then(m => m.EsportsAppApplicationUsersModule),
      },
      {
        path: 'organizers',
        loadChildren: () => import('./organizers/organizers.module').then(m => m.EsportsAppOrganizersModule),
      },
      {
        path: 'tournaments',
        loadChildren: () => import('./tournaments/tournaments.module').then(m => m.EsportsAppTournamentsModule),
      },
      {
        path: 'teams',
        loadChildren: () => import('./teams/teams.module').then(m => m.EsportsAppTeamsModule),
      },
      {
        path: 'matches',
        loadChildren: () => import('./matches/matches.module').then(m => m.EsportsAppMatchesModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EsportsAppEntityModule {}

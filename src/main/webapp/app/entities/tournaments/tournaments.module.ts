import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EsportsAppSharedModule } from 'app/shared/shared.module';
import { TournamentsComponent } from './tournaments.component';
import { TournamentsDetailComponent } from './tournaments-detail.component';
import { TournamentsUpdateComponent } from './tournaments-update.component';
import { TournamentsDeleteDialogComponent } from './tournaments-delete-dialog.component';
import { tournamentsRoute } from './tournaments.route';

@NgModule({
  imports: [EsportsAppSharedModule, RouterModule.forChild(tournamentsRoute)],
  declarations: [TournamentsComponent, TournamentsDetailComponent, TournamentsUpdateComponent, TournamentsDeleteDialogComponent],
  entryComponents: [TournamentsDeleteDialogComponent],
})
export class EsportsAppTournamentsModule {}

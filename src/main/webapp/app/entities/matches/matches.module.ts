import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EsportsAppSharedModule } from 'app/shared/shared.module';
import { MatchesComponent } from './matches.component';
import { MatchesDetailComponent } from './matches-detail.component';
import { MatchesUpdateComponent } from './matches-update.component';
import { MatchesDeleteDialogComponent } from './matches-delete-dialog.component';
import { matchesRoute } from './matches.route';

@NgModule({
  imports: [EsportsAppSharedModule, RouterModule.forChild(matchesRoute)],
  declarations: [MatchesComponent, MatchesDetailComponent, MatchesUpdateComponent, MatchesDeleteDialogComponent],
  entryComponents: [MatchesDeleteDialogComponent],
})
export class EsportsAppMatchesModule {}

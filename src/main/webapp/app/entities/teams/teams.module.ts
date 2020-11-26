import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EsportsAppSharedModule } from 'app/shared/shared.module';
import { TeamsComponent } from './teams.component';
import { TeamsDetailComponent } from './teams-detail.component';
import { TeamsUpdateComponent } from './teams-update.component';
import { TeamsDeleteDialogComponent } from './teams-delete-dialog.component';
import { teamsRoute } from './teams.route';

@NgModule({
  imports: [EsportsAppSharedModule, RouterModule.forChild(teamsRoute)],
  declarations: [TeamsComponent, TeamsDetailComponent, TeamsUpdateComponent, TeamsDeleteDialogComponent],
  entryComponents: [TeamsDeleteDialogComponent],
})
export class EsportsAppTeamsModule {}

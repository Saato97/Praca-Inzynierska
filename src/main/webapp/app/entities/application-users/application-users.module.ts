import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EsportsAppSharedModule } from 'app/shared/shared.module';
import { ApplicationUsersComponent } from './application-users.component';
import { ApplicationUsersDetailComponent } from './application-users-detail.component';
import { ApplicationUsersUpdateComponent } from './application-users-update.component';
import { ApplicationUsersDeleteDialogComponent } from './application-users-delete-dialog.component';
import { applicationUsersRoute } from './application-users.route';

@NgModule({
  imports: [EsportsAppSharedModule, RouterModule.forChild(applicationUsersRoute)],
  declarations: [
    ApplicationUsersComponent,
    ApplicationUsersDetailComponent,
    ApplicationUsersUpdateComponent,
    ApplicationUsersDeleteDialogComponent,
  ],
  entryComponents: [ApplicationUsersDeleteDialogComponent],
})
export class EsportsAppApplicationUsersModule {}

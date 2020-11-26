import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EsportsAppSharedModule } from 'app/shared/shared.module';
import { OrganizersComponent } from './organizers.component';
import { OrganizersDetailComponent } from './organizers-detail.component';
import { OrganizersUpdateComponent } from './organizers-update.component';
import { OrganizersDeleteDialogComponent } from './organizers-delete-dialog.component';
import { organizersRoute } from './organizers.route';

@NgModule({
  imports: [EsportsAppSharedModule, RouterModule.forChild(organizersRoute)],
  declarations: [OrganizersComponent, OrganizersDetailComponent, OrganizersUpdateComponent, OrganizersDeleteDialogComponent],
  entryComponents: [OrganizersDeleteDialogComponent],
})
export class EsportsAppOrganizersModule {}

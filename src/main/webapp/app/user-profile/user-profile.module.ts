import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EsportsAppSharedModule } from '../shared/shared.module';

import { USER_PROFILE_ROUTE, UserProfileComponent } from './';

@NgModule({
  imports: [EsportsAppSharedModule, RouterModule.forRoot([USER_PROFILE_ROUTE], { useHash: true })],
  declarations: [UserProfileComponent],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EsportsAppUserProfileModule {}

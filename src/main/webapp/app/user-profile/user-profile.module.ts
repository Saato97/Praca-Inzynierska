import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EsportsAppSharedModule } from '../shared/shared.module';

import { USER_PROFILE_ROUTE, UserProfileComponent } from './';

@NgModule({
  imports: [EsportsAppSharedModule, BrowserModule, NgbModule, RouterModule.forRoot([USER_PROFILE_ROUTE], { useHash: true })],
  declarations: [UserProfileComponent],
  entryComponents: [],
  exports: [UserProfileComponent],
  bootstrap: [UserProfileComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EsportsAppUserProfileModule {}

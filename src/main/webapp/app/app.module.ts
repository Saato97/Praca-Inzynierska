import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { EsportsAppSharedModule } from 'app/shared/shared.module';
import { EsportsAppCoreModule } from 'app/core/core.module';
import { EsportsAppAppRoutingModule } from './app-routing.module';
import { EsportsAppHomeModule } from './home/home.module';
import { EsportsAppEntityModule } from './entities/entity.module';
import { EsportsAppUserProfileModule } from './user-profile/user-profile.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    EsportsAppSharedModule,
    EsportsAppCoreModule,
    EsportsAppHomeModule,
    EsportsAppUserProfileModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    EsportsAppEntityModule,
    EsportsAppAppRoutingModule,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [MainComponent],
})
export class EsportsAppAppModule {}

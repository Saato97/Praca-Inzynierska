import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EsportsAppSharedModule } from 'app/shared/shared.module';
import { GameComponent } from './game.component';
import { GameDetailComponent } from './game-detail.component';
import { GameUpdateComponent } from './game-update.component';
import { GameDeleteDialogComponent } from './game-delete-dialog.component';
import { gameRoute } from './game.route';

@NgModule({
  imports: [EsportsAppSharedModule, RouterModule.forChild(gameRoute)],
  declarations: [GameComponent, GameDetailComponent, GameUpdateComponent, GameDeleteDialogComponent],
  entryComponents: [GameDeleteDialogComponent],
})
export class EsportsAppGameModule {}

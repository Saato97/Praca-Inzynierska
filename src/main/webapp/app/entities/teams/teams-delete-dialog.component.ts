import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITeams } from 'app/shared/model/teams.model';
import { TeamsService } from './teams.service';

@Component({
  templateUrl: './teams-delete-dialog.component.html',
})
export class TeamsDeleteDialogComponent {
  teams?: ITeams;

  constructor(protected teamsService: TeamsService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.teamsService.delete(id).subscribe(() => {
      this.eventManager.broadcast('teamsListModification');
      this.activeModal.close();
    });
  }
}

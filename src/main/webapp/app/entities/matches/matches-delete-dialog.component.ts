import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMatches } from 'app/shared/model/matches.model';
import { MatchesService } from './matches.service';

@Component({
  templateUrl: './matches-delete-dialog.component.html',
})
export class MatchesDeleteDialogComponent {
  matches?: IMatches;

  constructor(protected matchesService: MatchesService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.matchesService.delete(id).subscribe(() => {
      this.eventManager.broadcast('matchesListModification');
      this.activeModal.close();
    });
  }
}

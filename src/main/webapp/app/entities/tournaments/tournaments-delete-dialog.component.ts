import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITournaments } from 'app/shared/model/tournaments.model';
import { TournamentsService } from './tournaments.service';

@Component({
  templateUrl: './tournaments-delete-dialog.component.html',
})
export class TournamentsDeleteDialogComponent {
  tournaments?: ITournaments;

  constructor(
    protected tournamentsService: TournamentsService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tournamentsService.delete(id).subscribe(() => {
      this.eventManager.broadcast('tournamentsListModification');
      this.activeModal.close();
    });
  }
}

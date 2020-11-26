import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOrganizers } from 'app/shared/model/organizers.model';
import { OrganizersService } from './organizers.service';

@Component({
  templateUrl: './organizers-delete-dialog.component.html',
})
export class OrganizersDeleteDialogComponent {
  organizers?: IOrganizers;

  constructor(
    protected organizersService: OrganizersService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.organizersService.delete(id).subscribe(() => {
      this.eventManager.broadcast('organizersListModification');
      this.activeModal.close();
    });
  }
}

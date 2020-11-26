import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IApplicationUsers } from 'app/shared/model/application-users.model';
import { ApplicationUsersService } from './application-users.service';

@Component({
  templateUrl: './application-users-delete-dialog.component.html',
})
export class ApplicationUsersDeleteDialogComponent {
  applicationUsers?: IApplicationUsers;

  constructor(
    protected applicationUsersService: ApplicationUsersService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.applicationUsersService.delete(id).subscribe(() => {
      this.eventManager.broadcast('applicationUsersListModification');
      this.activeModal.close();
    });
  }
}

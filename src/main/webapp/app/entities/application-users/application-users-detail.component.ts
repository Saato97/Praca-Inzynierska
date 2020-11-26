import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IApplicationUsers } from 'app/shared/model/application-users.model';

@Component({
  selector: 'jhi-application-users-detail',
  templateUrl: './application-users-detail.component.html',
})
export class ApplicationUsersDetailComponent implements OnInit {
  applicationUsers: IApplicationUsers | null = null;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applicationUsers }) => (this.applicationUsers = applicationUsers));
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  previousState(): void {
    window.history.back();
  }
}

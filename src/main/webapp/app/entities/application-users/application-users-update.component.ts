import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IApplicationUsers, ApplicationUsers } from 'app/shared/model/application-users.model';
import { ApplicationUsersService } from './application-users.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-application-users-update',
  templateUrl: './application-users-update.component.html',
})
export class ApplicationUsersUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    level: [null, [Validators.min(1), Validators.max(100)]],
    points: [],
    userLogo: [],
    userLogoContentType: [],
    username: [null, [Validators.minLength(6)]],
    internalUser: [],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected applicationUsersService: ApplicationUsersService,
    protected userService: UserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applicationUsers }) => {
      this.updateForm(applicationUsers);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(applicationUsers: IApplicationUsers): void {
    this.editForm.patchValue({
      id: applicationUsers.id,
      level: applicationUsers.level,
      points: applicationUsers.points,
      userLogo: applicationUsers.userLogo,
      userLogoContentType: applicationUsers.userLogoContentType,
      username: applicationUsers.username,
      internalUser: applicationUsers.internalUser,
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  setFileData(event: any, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe(null, (err: JhiFileLoadError) => {
      this.eventManager.broadcast(
        new JhiEventWithContent<AlertError>('esportsApp.error', { ...err, key: 'error.file.' + err.key })
      );
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const applicationUsers = this.createFromForm();
    if (applicationUsers.id !== undefined) {
      this.subscribeToSaveResponse(this.applicationUsersService.update(applicationUsers));
    } else {
      this.subscribeToSaveResponse(this.applicationUsersService.create(applicationUsers));
    }
  }

  private createFromForm(): IApplicationUsers {
    return {
      ...new ApplicationUsers(),
      id: this.editForm.get(['id'])!.value,
      level: this.editForm.get(['level'])!.value,
      points: this.editForm.get(['points'])!.value,
      userLogoContentType: this.editForm.get(['userLogoContentType'])!.value,
      userLogo: this.editForm.get(['userLogo'])!.value,
      username: this.editForm.get(['username'])!.value,
      internalUser: this.editForm.get(['internalUser'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IApplicationUsers>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IUser): any {
    return item.id;
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IOrganizers, Organizers } from 'app/shared/model/organizers.model';
import { OrganizersService } from './organizers.service';
import { IApplicationUsers } from 'app/shared/model/application-users.model';
import { ApplicationUsersService } from 'app/entities/application-users/application-users.service';

@Component({
  selector: 'jhi-organizers-update',
  templateUrl: './organizers-update.component.html',
})
export class OrganizersUpdateComponent implements OnInit {
  isSaving = false;
  applicationusers: IApplicationUsers[] = [];

  editForm = this.fb.group({
    id: [],
    email: [],
    discord: [],
    applicationUsers: [],
  });

  constructor(
    protected organizersService: OrganizersService,
    protected applicationUsersService: ApplicationUsersService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizers }) => {
      this.updateForm(organizers);

      this.applicationUsersService
        .query({ filter: 'organizers-is-null' })
        .pipe(
          map((res: HttpResponse<IApplicationUsers[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IApplicationUsers[]) => {
          if (!organizers.applicationUsers || !organizers.applicationUsers.id) {
            this.applicationusers = resBody;
          } else {
            this.applicationUsersService
              .find(organizers.applicationUsers.id)
              .pipe(
                map((subRes: HttpResponse<IApplicationUsers>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IApplicationUsers[]) => (this.applicationusers = concatRes));
          }
        });
    });
  }

  updateForm(organizers: IOrganizers): void {
    this.editForm.patchValue({
      id: organizers.id,
      email: organizers.email,
      discord: organizers.discord,
      applicationUsers: organizers.applicationUsers,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const organizers = this.createFromForm();
    if (organizers.id !== undefined) {
      this.subscribeToSaveResponse(this.organizersService.update(organizers));
    } else {
      this.subscribeToSaveResponse(this.organizersService.create(organizers));
    }
  }

  private createFromForm(): IOrganizers {
    return {
      ...new Organizers(),
      id: this.editForm.get(['id'])!.value,
      email: this.editForm.get(['email'])!.value,
      discord: this.editForm.get(['discord'])!.value,
      applicationUsers: this.editForm.get(['applicationUsers'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganizers>>): void {
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

  trackById(index: number, item: IApplicationUsers): any {
    return item.id;
  }
}

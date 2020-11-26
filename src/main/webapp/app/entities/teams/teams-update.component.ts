import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { ITeams, Teams } from 'app/shared/model/teams.model';
import { TeamsService } from './teams.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { IApplicationUsers } from 'app/shared/model/application-users.model';
import { ApplicationUsersService } from 'app/entities/application-users/application-users.service';
import { IMatches } from 'app/shared/model/matches.model';
import { MatchesService } from 'app/entities/matches/matches.service';

type SelectableEntity = IApplicationUsers | IMatches;

@Component({
  selector: 'jhi-teams-update',
  templateUrl: './teams-update.component.html',
})
export class TeamsUpdateComponent implements OnInit {
  isSaving = false;
  applicationusers: IApplicationUsers[] = [];
  matches: IMatches[] = [];

  editForm = this.fb.group({
    id: [],
    teamName: [null, [Validators.required]],
    captainName: [null, [Validators.required]],
    teamLogo: [],
    teamLogoContentType: [],
    applicationUsers: [],
    matches: [],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected teamsService: TeamsService,
    protected applicationUsersService: ApplicationUsersService,
    protected matchesService: MatchesService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ teams }) => {
      this.updateForm(teams);

      this.applicationUsersService.query().subscribe((res: HttpResponse<IApplicationUsers[]>) => (this.applicationusers = res.body || []));

      this.matchesService.query().subscribe((res: HttpResponse<IMatches[]>) => (this.matches = res.body || []));
    });
  }

  updateForm(teams: ITeams): void {
    this.editForm.patchValue({
      id: teams.id,
      teamName: teams.teamName,
      captainName: teams.captainName,
      teamLogo: teams.teamLogo,
      teamLogoContentType: teams.teamLogoContentType,
      applicationUsers: teams.applicationUsers,
      matches: teams.matches,
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
    const teams = this.createFromForm();
    if (teams.id !== undefined) {
      this.subscribeToSaveResponse(this.teamsService.update(teams));
    } else {
      this.subscribeToSaveResponse(this.teamsService.create(teams));
    }
  }

  private createFromForm(): ITeams {
    return {
      ...new Teams(),
      id: this.editForm.get(['id'])!.value,
      teamName: this.editForm.get(['teamName'])!.value,
      captainName: this.editForm.get(['captainName'])!.value,
      teamLogoContentType: this.editForm.get(['teamLogoContentType'])!.value,
      teamLogo: this.editForm.get(['teamLogo'])!.value,
      applicationUsers: this.editForm.get(['applicationUsers'])!.value,
      matches: this.editForm.get(['matches'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITeams>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  getSelected(selectedVals: IApplicationUsers[], option: IApplicationUsers): IApplicationUsers {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}

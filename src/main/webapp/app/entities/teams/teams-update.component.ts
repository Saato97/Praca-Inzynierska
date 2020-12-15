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
import { ITournaments } from 'app/shared/model/tournaments.model';
import { TournamentsService } from 'app/entities/tournaments/tournaments.service';
import { IMatches } from 'app/shared/model/matches.model';
import { MatchesService } from 'app/entities/matches/matches.service';

type SelectableEntity = IApplicationUsers | ITournaments | IMatches;

@Component({
  selector: 'jhi-teams-update',
  templateUrl: './teams-update.component.html',
})
export class TeamsUpdateComponent implements OnInit {
  isSaving = false;
  applicationusers: IApplicationUsers[] = [];
  tournaments: ITournaments[] = [];
  matches: IMatches[] = [];
  tournamentId: number;
  tournament!: ITournaments;

  editForm = this.fb.group({
    id: [],
    teamName: [null, [Validators.required]],
    captainName: [null, [Validators.required]],
    teamLogo: [],
    teamLogoContentType: [],
    applicationUsers: [],
    tournaments: [],
    matches: [],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected teamsService: TeamsService,
    protected applicationUsersService: ApplicationUsersService,
    protected tournamentsService: TournamentsService,
    protected matchesService: MatchesService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.tournamentId = 0;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ teams }) => {
      if (teams) this.updateForm(teams);

      this.applicationUsersService.query().subscribe((res: HttpResponse<IApplicationUsers[]>) => (this.applicationusers = res.body || []));

      this.tournamentsService.query().subscribe((res: HttpResponse<ITournaments[]>) => {
        this.tournaments = res.body || [];
        this.tournamentId = +this.activatedRoute.snapshot.paramMap.get('id')!;
        this.tournamentsService.find(this.tournamentId).subscribe(tournament => {
          if (tournament.body) this.tournament = tournament.body;
        });
      });

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
      tournaments: teams.tournaments,
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
    if (teams.id !== undefined && teams.id !== null) {
      this.subscribeToSaveResponseUpdate(this.teamsService.update(teams));
    } else {
      this.subscribeToSaveResponseCreate(this.teamsService.create(teams));
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
      tournaments: this.tournament,
      matches: this.editForm.get(['matches'])!.value,
    };
  }

  protected subscribeToSaveResponseCreate(result: Observable<HttpResponse<ITeams>>): void {
    result.subscribe(
      () => this.onSaveSuccessCreate(),
      () => this.onSaveError()
    );
  }

  protected subscribeToSaveResponseUpdate(result: Observable<HttpResponse<ITeams>>): void {
    result.subscribe(
      () => this.onSaveSuccessUpdate(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccessCreate(): void {
    this.tournament.currentParticipants!++;
    this.tournamentsService.update(this.tournament).subscribe();
    this.isSaving = false;
    this.previousState();
  }
  protected onSaveSuccessUpdate(): void {
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

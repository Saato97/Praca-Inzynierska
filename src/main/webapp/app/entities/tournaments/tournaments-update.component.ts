import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { ITournaments, Tournaments } from 'app/shared/model/tournaments.model';
import { TournamentsService } from './tournaments.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { IOrganizers } from 'app/shared/model/organizers.model';
import { OrganizersService } from 'app/entities/organizers/organizers.service';
import { ITeams } from 'app/shared/model/teams.model';
import { TeamsService } from 'app/entities/teams/teams.service';
import { IMatches } from 'app/shared/model/matches.model';
import { MatchesService } from 'app/entities/matches/matches.service';

type SelectableEntity = IOrganizers | ITeams | IMatches;

@Component({
  selector: 'jhi-tournaments-update',
  templateUrl: './tournaments-update.component.html',
})
export class TournamentsUpdateComponent implements OnInit {
  isSaving = false;
  organizers: IOrganizers[] = [];
  teams: ITeams[] = [];
  matches: IMatches[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    gameType: [],
    description: [],
    maxParticipants: [null, [Validators.required]],
    currentParticipants: [],
    startDate: [null, [Validators.required]],
    tournamentLogo: [],
    tournamentLogoContentType: [],
    organizers: [],
    teams: [],
    matches: [],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected tournamentsService: TournamentsService,
    protected organizersService: OrganizersService,
    protected teamsService: TeamsService,
    protected matchesService: MatchesService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tournaments }) => {
      if (!tournaments.id) {
        const today = moment().startOf('day');
        tournaments.startDate = today;
      }

      this.updateForm(tournaments);

      this.organizersService.query().subscribe((res: HttpResponse<IOrganizers[]>) => (this.organizers = res.body || []));

      this.teamsService.query().subscribe((res: HttpResponse<ITeams[]>) => (this.teams = res.body || []));

      this.matchesService.query().subscribe((res: HttpResponse<IMatches[]>) => (this.matches = res.body || []));
    });
  }

  updateForm(tournaments: ITournaments): void {
    this.editForm.patchValue({
      id: tournaments.id,
      name: tournaments.name,
      gameType: tournaments.gameType,
      description: tournaments.description,
      maxParticipants: tournaments.maxParticipants,
      currentParticipants: tournaments.currentParticipants,
      startDate: tournaments.startDate ? tournaments.startDate.format(DATE_TIME_FORMAT) : null,
      tournamentLogo: tournaments.tournamentLogo,
      tournamentLogoContentType: tournaments.tournamentLogoContentType,
      organizers: tournaments.organizers,
      teams: tournaments.teams,
      matches: tournaments.matches,
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
    const tournaments = this.createFromForm();
    if (tournaments.id !== undefined) {
      this.subscribeToSaveResponse(this.tournamentsService.update(tournaments));
    } else {
      this.subscribeToSaveResponse(this.tournamentsService.create(tournaments));
    }
  }

  private createFromForm(): ITournaments {
    return {
      ...new Tournaments(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      gameType: this.editForm.get(['gameType'])!.value,
      description: this.editForm.get(['description'])!.value,
      maxParticipants: this.editForm.get(['maxParticipants'])!.value,
      currentParticipants: this.editForm.get(['currentParticipants'])!.value,
      startDate: this.editForm.get(['startDate'])!.value ? moment(this.editForm.get(['startDate'])!.value, DATE_TIME_FORMAT) : undefined,
      tournamentLogoContentType: this.editForm.get(['tournamentLogoContentType'])!.value,
      tournamentLogo: this.editForm.get(['tournamentLogo'])!.value,
      organizers: this.editForm.get(['organizers'])!.value,
      teams: this.editForm.get(['teams'])!.value,
      matches: this.editForm.get(['matches'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITournaments>>): void {
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
}

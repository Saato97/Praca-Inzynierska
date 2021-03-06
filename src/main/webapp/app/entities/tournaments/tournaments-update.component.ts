import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { ITournaments, Tournaments } from 'app/shared/model/tournaments.model';
import { TournamentsService } from './tournaments.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { IOrganizers } from 'app/shared/model/organizers.model';
import { OrganizersService } from 'app/entities/organizers/organizers.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { AccountService } from 'app/core/auth/account.service';
import { takeUntil } from 'rxjs/operators';
import { IGame } from 'app/shared/model/game.model';
import { GameService } from 'app/entities/game/game.service';

@Component({
  selector: 'jhi-tournaments-update',
  templateUrl: './tournaments-update.component.html',
})
export class TournamentsUpdateComponent implements OnInit, OnDestroy {
  isSaving = false;
  organizers: IOrganizers[] = [];
  games: IGame[] = [];
  tournaments!: ITournaments;
  user!: IUser;
  private ngUnsubscribe = new Subject();

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
    status: [],
    organizers: [],
    game: [],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected tournamentsService: TournamentsService,
    protected organizersService: OrganizersService,
    protected gameService: GameService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected accountService: AccountService,
    protected userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tournaments }) => {
      if (!tournaments.id) {
        const today = moment().startOf('day');
        tournaments.startDate = today;
      }

      this.gameService
        .query()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res: HttpResponse<IGame[]>) => (this.games = res.body || []));

      this.updateForm(tournaments);

      this.organizersService
        .query()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res: HttpResponse<IOrganizers[]>) => (this.organizers = res.body || []));
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
      game: tournaments.game,
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

  tournamentCreated(): void {
    this.router.navigate(['/tournaments']);
  }

  save(): void {
    this.isSaving = true;
    this.tournaments = this.createFromForm();
    if (this.tournaments.currentParticipants === null) this.tournaments.currentParticipants = 0;
    if (this.tournaments.id !== undefined) {
      this.subscribeToSaveResponse(this.tournamentsService.update(this.tournaments));
    } else {
      this.accountService
        .getAuthenticationState()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(account => {
          if (account) {
            this.userService
              .find(account.login)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(user => {
                this.user = user;
                for (let i = 0; i < this.organizers.length; i++) {
                  if (this.organizers[i].applicationUsers?.id === this.user.id) {
                    this.tournaments.organizers = this.organizers[i];
                    break;
                  }
                }
                this.subscribeToSaveResponse(this.tournamentsService.create(this.tournaments));
              });
          }
        });
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
      currentParticipants: 0,
      startDate: this.editForm.get(['startDate'])!.value ? moment(this.editForm.get(['startDate'])!.value, DATE_TIME_FORMAT) : undefined,
      tournamentLogoContentType: this.editForm.get(['tournamentLogoContentType'])!.value,
      tournamentLogo: this.editForm.get(['tournamentLogo'])!.value,
      status: 'created',
      organizers: this.editForm.get(['organizers'])!.value,
      game: this.editForm.get(['game'])!.value,
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
    this.tournamentCreated();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IOrganizers): any {
    return item.id;
  }

  trackByIdG(index: number, item: IGame): any {
    return item.id;
  }
}

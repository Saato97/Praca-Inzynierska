import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IMatches, Matches } from 'app/shared/model/matches.model';
import { MatchesService } from './matches.service';
import { ITournaments } from 'app/shared/model/tournaments.model';
import { TournamentsService } from 'app/entities/tournaments/tournaments.service';

@Component({
  selector: 'jhi-matches-update',
  templateUrl: './matches-update.component.html',
})
export class MatchesUpdateComponent implements OnInit {
  isSaving = false;
  tournaments: ITournaments[] = [];

  editForm = this.fb.group({
    id: [],
    startDate: [],
    teamA: [],
    teamB: [],
    winner: [],
    matchUrl: [],
    tournaments: [],
  });

  constructor(
    protected matchesService: MatchesService,
    protected tournamentsService: TournamentsService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ matches }) => {
      if (!matches.id) {
        const today = moment().startOf('day');
        matches.startDate = today;
      }

      this.updateForm(matches);

      this.tournamentsService.query().subscribe((res: HttpResponse<ITournaments[]>) => (this.tournaments = res.body || []));
    });
  }

  updateForm(matches: IMatches): void {
    this.editForm.patchValue({
      id: matches.id,
      startDate: matches.startDate ? matches.startDate.format(DATE_TIME_FORMAT) : null,
      teamA: matches.teamA,
      teamB: matches.teamB,
      winner: matches.winner,
      matchUrl: matches.matchUrl,
      tournaments: matches.tournaments,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const matches = this.createFromForm();
    if (matches.id !== undefined) {
      this.subscribeToSaveResponse(this.matchesService.update(matches));
    } else {
      this.subscribeToSaveResponse(this.matchesService.create(matches));
    }
  }

  private createFromForm(): IMatches {
    return {
      ...new Matches(),
      id: this.editForm.get(['id'])!.value,
      startDate: this.editForm.get(['startDate'])!.value ? moment(this.editForm.get(['startDate'])!.value, DATE_TIME_FORMAT) : undefined,
      teamA: this.editForm.get(['teamA'])!.value,
      teamB: this.editForm.get(['teamB'])!.value,
      winner: this.editForm.get(['winner'])!.value,
      matchUrl: this.editForm.get(['matchUrl'])!.value,
      tournaments: this.editForm.get(['tournaments'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMatches>>): void {
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

  trackById(index: number, item: ITournaments): any {
    return item.id;
  }
}

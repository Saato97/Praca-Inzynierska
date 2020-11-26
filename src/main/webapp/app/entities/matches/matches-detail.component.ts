import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMatches } from 'app/shared/model/matches.model';

@Component({
  selector: 'jhi-matches-detail',
  templateUrl: './matches-detail.component.html',
})
export class MatchesDetailComponent implements OnInit {
  matches: IMatches | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ matches }) => (this.matches = matches));
  }

  previousState(): void {
    window.history.back();
  }
}

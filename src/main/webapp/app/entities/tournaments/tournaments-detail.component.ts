import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { ITournaments } from 'app/shared/model/tournaments.model';

@Component({
  selector: 'jhi-tournaments-detail',
  templateUrl: './tournaments-detail.component.html',
})
export class TournamentsDetailComponent implements OnInit {
  tournaments: ITournaments | null = null;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tournaments }) => (this.tournaments = tournaments));
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

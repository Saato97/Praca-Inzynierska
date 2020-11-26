import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITournaments } from 'app/shared/model/tournaments.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { TournamentsService } from './tournaments.service';
import { TournamentsDeleteDialogComponent } from './tournaments-delete-dialog.component';

@Component({
  selector: 'jhi-tournaments',
  templateUrl: './tournaments.component.html',
})
export class TournamentsComponent implements OnInit, OnDestroy {
  tournaments: ITournaments[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected tournamentsService: TournamentsService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.tournaments = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.tournamentsService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<ITournaments[]>) => this.paginateTournaments(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.tournaments = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInTournaments();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ITournaments): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInTournaments(): void {
    this.eventSubscriber = this.eventManager.subscribe('tournamentsListModification', () => this.reset());
  }

  delete(tournaments: ITournaments): void {
    const modalRef = this.modalService.open(TournamentsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tournaments = tournaments;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateTournaments(data: ITournaments[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.tournaments.push(data[i]);
      }
    }
  }
}

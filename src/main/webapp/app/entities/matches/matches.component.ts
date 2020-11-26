import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMatches } from 'app/shared/model/matches.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { MatchesService } from './matches.service';
import { MatchesDeleteDialogComponent } from './matches-delete-dialog.component';

@Component({
  selector: 'jhi-matches',
  templateUrl: './matches.component.html',
})
export class MatchesComponent implements OnInit, OnDestroy {
  matches: IMatches[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected matchesService: MatchesService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.matches = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.matchesService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<IMatches[]>) => this.paginateMatches(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.matches = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInMatches();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IMatches): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInMatches(): void {
    this.eventSubscriber = this.eventManager.subscribe('matchesListModification', () => this.reset());
  }

  delete(matches: IMatches): void {
    const modalRef = this.modalService.open(MatchesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.matches = matches;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateMatches(data: IMatches[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.matches.push(data[i]);
      }
    }
  }
}

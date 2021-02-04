import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGame } from 'app/shared/model/game.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { GameService } from './game.service';
import { GameDeleteDialogComponent } from './game-delete-dialog.component';

@Component({
  selector: 'jhi-game',
  templateUrl: './game.component.html',
})
export class GameComponent implements OnInit, OnDestroy {
  games: IGame[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected gameService: GameService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.games = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.gameService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<IGame[]>) => this.paginateGames(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.games = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInGames();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IGame): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInGames(): void {
    this.eventSubscriber = this.eventManager.subscribe('gameListModification', () => this.reset());
  }

  delete(game: IGame): void {
    const modalRef = this.modalService.open(GameDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.game = game;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateGames(data: IGame[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.games.push(data[i]);
      }
    }
  }
}

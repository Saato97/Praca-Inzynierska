import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'app/core/auth/account.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { OrganizersService } from 'app/entities/organizers/organizers.service';
import { TournamentsService } from 'app/entities/tournaments/tournaments.service';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { IOrganizers } from 'app/shared/model/organizers.model';
import { ITournaments } from 'app/shared/model/tournaments.model';
import { JhiDataUtils, JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'jhi-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  active = 1;
  tournaments: ITournaments[];
  organizers: IOrganizers[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;
  user!: IUser;
  private ngUnsubscribe = new Subject();

  constructor(
    protected tournamentsService: TournamentsService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected router: Router,
    protected organizersService: OrganizersService,
    protected accountService: AccountService,
    protected userService: UserService,
    protected parseLinks: JhiParseLinks
  ) {
    this.tournaments = [];
    this.organizers = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'startDate';
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
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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

import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'app/core/auth/account.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { UserProfileService } from 'app/user-profile/user-profile.service';
import { MatchesService } from 'app/entities/matches/matches.service';
import { OrganizersService } from 'app/entities/organizers/organizers.service';
import { TournamentsService } from 'app/entities/tournaments/tournaments.service';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { IMatches } from 'app/shared/model/matches.model';
import { IOrganizers } from 'app/shared/model/organizers.model';
import { ITournaments } from 'app/shared/model/tournaments.model';
import { JhiDataUtils, JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  active = 1;
  tournaments: ITournaments[];
  organizers: IOrganizers[];
  matches: IMatches[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  linksT: any;
  linksM: any;
  pageT: number;
  pageM: number;
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
    protected matchesService: MatchesService,
    protected accountService: AccountService,
    protected userProfileService: UserProfileService,
    protected userService: UserService,
    protected parseLinks: JhiParseLinks
  ) {
    this.tournaments = [];
    this.organizers = [];
    this.matches = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.pageT = 0;
    this.pageM = 0;
    this.linksT = {
      last: 0,
    };
    this.linksM = {
      last: 0,
    };
    this.predicate = 'startDate';
    this.ascending = true;
  }

  loadMyTournaments(): void {
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
              this.tournamentsService
                .query({
                  page: this.pageT,
                  size: this.itemsPerPage,
                  sort: this.sort(),
                })
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((res: HttpResponse<ITournaments[]>) => {
                  if (res.body) {
                    const tournaments: ITournaments[] = [];
                    for (let i = 0; i < res.body.length; i++) {
                      if (res.body[i].organizers?.applicationUsers?.id === this.user.id) {
                        tournaments.push(res.body[i]);
                      }
                    }
                    this.paginateTournaments(tournaments, res.headers);
                  }
                });
            });
        }
      });
  }

  loadMyMatches(): void {
    this.userProfileService
      .myMatches({
        page: this.pageM,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: HttpResponse<IMatches[]>) => this.paginateMatches(res.body, res.headers));
  }

  reset(): void {
    this.pageT = 0;
    this.tournaments = [];
    this.loadMyTournaments();
  }

  resetM(): void {
    this.pageM = 0;
    this.matches = [];
    this.loadMyMatches();
  }

  loadPageT(pageT: number): void {
    this.pageT = pageT;
    this.loadMyTournaments();
  }

  loadPageM(pageM: number): void {
    this.pageM = pageM;
    this.loadMyMatches();
  }

  ngOnInit(): void {
    this.loadMyTournaments();
    this.registerChangeInTournaments();
    this.loadMyMatches();
    this.registerChangeInMatches();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  trackIdT(index: number, item: ITournaments): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  trackIdM(index: number, item: IMatches): number {
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

  registerChangeInMatches(): void {
    this.eventSubscriber = this.eventManager.subscribe('matchesListModification', () => this.resetM());
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
    this.linksT = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.tournaments.push(data[i]);
      }
    }
  }

  protected paginateMatches(data: IMatches[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.linksM = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.matches.push(data[i]);
      }
    }
  }
}

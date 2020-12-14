import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils, JhiEventManager, JhiParseLinks } from 'ng-jhipster';

import { ITournaments } from 'app/shared/model/tournaments.model';
import { IUser } from 'app/core/user/user.model';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { AccountService } from 'app/core/auth/account.service';
import { UserService } from 'app/core/user/user.service';
import { ApplicationUsersService } from '../application-users/application-users.service';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ITeams } from 'app/shared/model/teams.model';
import { TeamsService } from '../teams/teams.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-tournaments-detail',
  templateUrl: './tournaments-detail.component.html',
  styleUrls: ['tournaments.scss'],
})
export class TournamentsDetailComponent implements OnInit, OnDestroy {
  tournaments: ITournaments | null = null;
  eventSubscriber?: Subscription;
  teams: ITeams[];
  user!: IUser;
  active = 1;
  itemsPerPage: number;
  links: any;
  page: number;
  private ngUnsubscribe = new Subject();
  predicate: string;
  ascending: boolean;
  participant: boolean;

  constructor(
    protected dataUtils: JhiDataUtils,
    protected teamsService: TeamsService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    protected applicationUsersService: ApplicationUsersService,
    protected userService: UserService,
    protected parseLinks: JhiParseLinks,
    protected eventManager: JhiEventManager
  ) {
    this.teams = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
    this.participant = false;
  }

  startTournament(): void {}

  joinTournament(): void {}

  checkParticipant(userId: number): void {
    if (this.tournaments && this.tournaments.id) {
      this.applicationUsersService
        .findParticipant({
          appUserId: userId,
          tournamentId: this.tournaments.id,
        })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          // eslint-disable-next-line no-console
          console.log('Res body:' + res.body);
          if (res.body != null) this.participant = true;
          else this.participant = false;
        });
    }
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tournaments }) => (this.tournaments = tournaments));
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
              this.checkParticipant(this.user.id);
            });
        }
      });
    this.loadTeams();
    this.registerChangeInTeams();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  reset(): void {
    this.page = 0;
    this.teams = [];
    this.loadTeams();
    this.checkParticipant(this.user.id);
  }

  loadTeams(): void {
    this.teamsService
      .findTournamentTeams({
        tournamentId: this.tournaments?.id,
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<ITeams[]>) => this.paginateTeams(res.body, res.headers));
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadTeams();
  }

  trackId(index: number, item: ITeams): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateTeams(data: ITeams[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.teams.push(data[i]);
      }
    }
  }

  registerChangeInTeams(): void {
    this.eventSubscriber = this.eventManager.subscribe('teamsListModification', () => this.reset());
  }

  previousState(): void {
    window.history.back();
  }
}

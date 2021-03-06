import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiDataUtils, JhiEventManager, JhiParseLinks } from 'ng-jhipster';

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
import * as moment from 'moment';
import { IMatches } from 'app/shared/model/matches.model';
import { TournamentsService } from './tournaments.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-tournaments-detail',
  templateUrl: './tournaments-detail.component.html',
  styleUrls: ['tournaments.scss'],
})
export class TournamentsDetailComponent implements OnInit, OnDestroy {
  tournaments: ITournaments | null = null;
  eventSubscriber?: Subscription;
  teams: ITeams[];
  matches: IMatches[];
  user!: IUser;
  active = 1;
  itemsPerPage: number;
  links: any;
  page: number;
  pageM: number;
  round: number;
  status: string;
  statusTranslated: string;
  private ngUnsubscribe = new Subject();
  predicate: string;
  ascending: boolean;
  participant: boolean;
  tournamentStarted: boolean;

  constructor(
    protected dataUtils: JhiDataUtils,
    protected teamsService: TeamsService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    protected applicationUsersService: ApplicationUsersService,
    protected tournamentsService: TournamentsService,
    protected translateService: TranslateService,
    protected userService: UserService,
    protected alertService: JhiAlertService,
    protected parseLinks: JhiParseLinks,
    protected router: Router,
    protected eventManager: JhiEventManager
  ) {
    this.teams = [];
    this.matches = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.pageM = 0;
    this.round = 0;
    this.status = '';
    this.statusTranslated = '';
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
    this.participant = false;
    this.tournamentStarted = false;
  }

  startTournament(): void {
    if (this.tournaments?.startDate?.isAfter(moment())) {
      this.showAlert('esportsApp.tournaments.startError');
    } else {
      this.tournaments!.status = 'started';
      this.tournamentsService.update(this.tournaments!).subscribe();
      this.tournamentStarted = true;
    }
  }

  joinTournament(): void {
    if (this.tournaments?.currentParticipants! < this.tournaments?.maxParticipants!) {
      if (this.tournaments?.startDate?.isAfter(moment())) {
        this.router.navigate(['/tournaments', this.tournaments.id, 'teams', 'new']);
      } else this.showAlert('esportsApp.tournaments.joinDateError');
    } else this.showAlert('esportsApp.tournaments.maxParticipantsError');
  }

  checkParticipant(userId: number): void {
    if (this.tournaments && this.tournaments.id) {
      this.applicationUsersService
        .findParticipant({
          appUserId: userId,
          tournamentId: this.tournaments.id,
        })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          if (res.body != null) this.participant = true;
          else this.participant = false;
        });
    }
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tournaments }) => {
      this.tournaments = tournaments;
      if (this.tournaments?.status === 'started') {
        this.tournamentStarted = true;
      }
    });
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
    this.translateStatus();
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
    this.pageM = 0;
    this.matches = [];
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

  loadMatches(): void {}

  loadPage(page: number): void {
    this.page = page;
    this.loadTeams();
  }

  loadPageM(page: number): void {
    this.pageM = page;
    this.loadMatches();
  }

  trackId(index: number, item: ITeams): number {
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

  showAlert(alert: string): void {
    this.alertService.get().push(
      this.alertService.addAlert(
        {
          type: 'warning',
          msg: alert,
          timeout: 5000,
          toast: false,
          scoped: true,
        },
        this.alertService.get()
      )
    );
  }

  translateStatus(): void {
    const status = this.tournaments?.status!;
    if (status == null || status === 'created')
      this.statusTranslated = this.translateService.instant('esportsApp.tournaments.detail.statusNotStarted');
    else if (status === 'started') this.statusTranslated = this.translateService.instant('esportsApp.tournaments.detail.statusStarted');
    else if (status === 'ended') this.statusTranslated = this.translateService.instant('esportsApp.tournaments.detail.statusEnded');
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

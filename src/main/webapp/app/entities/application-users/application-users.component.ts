import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IApplicationUsers } from 'app/shared/model/application-users.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ApplicationUsersService } from './application-users.service';
import { ApplicationUsersDeleteDialogComponent } from './application-users-delete-dialog.component';

@Component({
  selector: 'jhi-application-users',
  templateUrl: './application-users.component.html',
})
export class ApplicationUsersComponent implements OnInit, OnDestroy {
  applicationUsers: IApplicationUsers[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected applicationUsersService: ApplicationUsersService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.applicationUsers = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.applicationUsersService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<IApplicationUsers[]>) => this.paginateApplicationUsers(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.applicationUsers = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInApplicationUsers();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IApplicationUsers): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInApplicationUsers(): void {
    this.eventSubscriber = this.eventManager.subscribe('applicationUsersListModification', () => this.reset());
  }

  delete(applicationUsers: IApplicationUsers): void {
    const modalRef = this.modalService.open(ApplicationUsersDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.applicationUsers = applicationUsers;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateApplicationUsers(data: IApplicationUsers[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.applicationUsers.push(data[i]);
      }
    }
  }
}

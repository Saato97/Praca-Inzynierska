import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrganizers } from 'app/shared/model/organizers.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { OrganizersService } from './organizers.service';
import { OrganizersDeleteDialogComponent } from './organizers-delete-dialog.component';

@Component({
  selector: 'jhi-organizers',
  templateUrl: './organizers.component.html',
})
export class OrganizersComponent implements OnInit, OnDestroy {
  organizers: IOrganizers[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected organizersService: OrganizersService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.organizers = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.organizersService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<IOrganizers[]>) => this.paginateOrganizers(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.organizers = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInOrganizers();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IOrganizers): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInOrganizers(): void {
    this.eventSubscriber = this.eventManager.subscribe('organizersListModification', () => this.reset());
  }

  delete(organizers: IOrganizers): void {
    const modalRef = this.modalService.open(OrganizersDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.organizers = organizers;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateOrganizers(data: IOrganizers[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.organizers.push(data[i]);
      }
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrganizers } from 'app/shared/model/organizers.model';

@Component({
  selector: 'jhi-organizers-detail',
  templateUrl: './organizers-detail.component.html',
})
export class OrganizersDetailComponent implements OnInit {
  organizers: IOrganizers | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizers }) => (this.organizers = organizers));
  }

  previousState(): void {
    window.history.back();
  }
}

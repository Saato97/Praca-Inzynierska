import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EsportsAppTestModule } from '../../../test.module';
import { OrganizersDetailComponent } from 'app/entities/organizers/organizers-detail.component';
import { Organizers } from 'app/shared/model/organizers.model';

describe('Component Tests', () => {
  describe('Organizers Management Detail Component', () => {
    let comp: OrganizersDetailComponent;
    let fixture: ComponentFixture<OrganizersDetailComponent>;
    const route = ({ data: of({ organizers: new Organizers(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EsportsAppTestModule],
        declarations: [OrganizersDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(OrganizersDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OrganizersDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load organizers on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.organizers).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

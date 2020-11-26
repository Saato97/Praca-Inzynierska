import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EsportsAppTestModule } from '../../../test.module';
import { MatchesDetailComponent } from 'app/entities/matches/matches-detail.component';
import { Matches } from 'app/shared/model/matches.model';

describe('Component Tests', () => {
  describe('Matches Management Detail Component', () => {
    let comp: MatchesDetailComponent;
    let fixture: ComponentFixture<MatchesDetailComponent>;
    const route = ({ data: of({ matches: new Matches(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EsportsAppTestModule],
        declarations: [MatchesDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(MatchesDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MatchesDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load matches on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.matches).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

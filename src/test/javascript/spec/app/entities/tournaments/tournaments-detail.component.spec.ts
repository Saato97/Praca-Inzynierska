import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { JhiDataUtils } from 'ng-jhipster';

import { EsportsAppTestModule } from '../../../test.module';
import { TournamentsDetailComponent } from 'app/entities/tournaments/tournaments-detail.component';
import { Tournaments } from 'app/shared/model/tournaments.model';

describe('Component Tests', () => {
  describe('Tournaments Management Detail Component', () => {
    let comp: TournamentsDetailComponent;
    let fixture: ComponentFixture<TournamentsDetailComponent>;
    let dataUtils: JhiDataUtils;
    const route = ({ data: of({ tournaments: new Tournaments(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EsportsAppTestModule],
        declarations: [TournamentsDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(TournamentsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TournamentsDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = fixture.debugElement.injector.get(JhiDataUtils);
    });

    describe('OnInit', () => {
      it('Should load tournaments on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.tournaments).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });

    describe('byteSize', () => {
      it('Should call byteSize from JhiDataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'byteSize');
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.byteSize(fakeBase64);

        // THEN
        expect(dataUtils.byteSize).toBeCalledWith(fakeBase64);
      });
    });

    describe('openFile', () => {
      it('Should call openFile from JhiDataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'openFile');
        const fakeContentType = 'fake content type';
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.openFile(fakeContentType, fakeBase64);

        // THEN
        expect(dataUtils.openFile).toBeCalledWith(fakeContentType, fakeBase64);
      });
    });
  });
});

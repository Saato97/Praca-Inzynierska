import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { JhiDataUtils } from 'ng-jhipster';

import { EsportsAppTestModule } from '../../../test.module';
import { ApplicationUsersDetailComponent } from 'app/entities/application-users/application-users-detail.component';
import { ApplicationUsers } from 'app/shared/model/application-users.model';

describe('Component Tests', () => {
  describe('ApplicationUsers Management Detail Component', () => {
    let comp: ApplicationUsersDetailComponent;
    let fixture: ComponentFixture<ApplicationUsersDetailComponent>;
    let dataUtils: JhiDataUtils;
    const route = ({ data: of({ applicationUsers: new ApplicationUsers(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EsportsAppTestModule],
        declarations: [ApplicationUsersDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ApplicationUsersDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ApplicationUsersDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = fixture.debugElement.injector.get(JhiDataUtils);
    });

    describe('OnInit', () => {
      it('Should load applicationUsers on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.applicationUsers).toEqual(jasmine.objectContaining({ id: 123 }));
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

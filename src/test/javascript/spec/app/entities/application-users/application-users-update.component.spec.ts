import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EsportsAppTestModule } from '../../../test.module';
import { ApplicationUsersUpdateComponent } from 'app/entities/application-users/application-users-update.component';
import { ApplicationUsersService } from 'app/entities/application-users/application-users.service';
import { ApplicationUsers } from 'app/shared/model/application-users.model';

describe('Component Tests', () => {
  describe('ApplicationUsers Management Update Component', () => {
    let comp: ApplicationUsersUpdateComponent;
    let fixture: ComponentFixture<ApplicationUsersUpdateComponent>;
    let service: ApplicationUsersService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EsportsAppTestModule],
        declarations: [ApplicationUsersUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ApplicationUsersUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ApplicationUsersUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ApplicationUsersService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ApplicationUsers(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new ApplicationUsers();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EsportsAppTestModule } from '../../../test.module';
import { OrganizersUpdateComponent } from 'app/entities/organizers/organizers-update.component';
import { OrganizersService } from 'app/entities/organizers/organizers.service';
import { Organizers } from 'app/shared/model/organizers.model';

describe('Component Tests', () => {
  describe('Organizers Management Update Component', () => {
    let comp: OrganizersUpdateComponent;
    let fixture: ComponentFixture<OrganizersUpdateComponent>;
    let service: OrganizersService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EsportsAppTestModule],
        declarations: [OrganizersUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(OrganizersUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrganizersUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrganizersService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Organizers(123);
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
        const entity = new Organizers();
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

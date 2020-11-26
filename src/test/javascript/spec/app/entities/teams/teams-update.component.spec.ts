import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EsportsAppTestModule } from '../../../test.module';
import { TeamsUpdateComponent } from 'app/entities/teams/teams-update.component';
import { TeamsService } from 'app/entities/teams/teams.service';
import { Teams } from 'app/shared/model/teams.model';

describe('Component Tests', () => {
  describe('Teams Management Update Component', () => {
    let comp: TeamsUpdateComponent;
    let fixture: ComponentFixture<TeamsUpdateComponent>;
    let service: TeamsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EsportsAppTestModule],
        declarations: [TeamsUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(TeamsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TeamsUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TeamsService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Teams(123);
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
        const entity = new Teams();
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

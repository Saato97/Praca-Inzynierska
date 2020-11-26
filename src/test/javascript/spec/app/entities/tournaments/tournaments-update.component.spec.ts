import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EsportsAppTestModule } from '../../../test.module';
import { TournamentsUpdateComponent } from 'app/entities/tournaments/tournaments-update.component';
import { TournamentsService } from 'app/entities/tournaments/tournaments.service';
import { Tournaments } from 'app/shared/model/tournaments.model';

describe('Component Tests', () => {
  describe('Tournaments Management Update Component', () => {
    let comp: TournamentsUpdateComponent;
    let fixture: ComponentFixture<TournamentsUpdateComponent>;
    let service: TournamentsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EsportsAppTestModule],
        declarations: [TournamentsUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(TournamentsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TournamentsUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TournamentsService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Tournaments(123);
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
        const entity = new Tournaments();
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

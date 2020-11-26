import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EsportsAppTestModule } from '../../../test.module';
import { MatchesUpdateComponent } from 'app/entities/matches/matches-update.component';
import { MatchesService } from 'app/entities/matches/matches.service';
import { Matches } from 'app/shared/model/matches.model';

describe('Component Tests', () => {
  describe('Matches Management Update Component', () => {
    let comp: MatchesUpdateComponent;
    let fixture: ComponentFixture<MatchesUpdateComponent>;
    let service: MatchesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EsportsAppTestModule],
        declarations: [MatchesUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(MatchesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MatchesUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MatchesService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Matches(123);
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
        const entity = new Matches();
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

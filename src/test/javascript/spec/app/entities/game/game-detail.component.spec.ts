import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EsportsAppTestModule } from '../../../test.module';
import { GameDetailComponent } from 'app/entities/game/game-detail.component';
import { Game } from 'app/shared/model/game.model';

describe('Component Tests', () => {
  describe('Game Management Detail Component', () => {
    let comp: GameDetailComponent;
    let fixture: ComponentFixture<GameDetailComponent>;
    const route = ({ data: of({ game: new Game(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EsportsAppTestModule],
        declarations: [GameDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(GameDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GameDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load game on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.game).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

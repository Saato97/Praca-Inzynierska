import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { TournamentsService } from 'app/entities/tournaments/tournaments.service';
import { ITournaments, Tournaments } from 'app/shared/model/tournaments.model';
import { Games } from 'app/shared/model/enumerations/games.model';

describe('Service Tests', () => {
  describe('Tournaments Service', () => {
    let injector: TestBed;
    let service: TournamentsService;
    let httpMock: HttpTestingController;
    let elemDefault: ITournaments;
    let expectedResult: ITournaments | ITournaments[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(TournamentsService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Tournaments(0, 'AAAAAAA', Games.LOL, 'AAAAAAA', 0, 0, currentDate, 'image/png', 'AAAAAAA', 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            startDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Tournaments', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            startDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
          },
          returnedFromService
        );

        service.create(new Tournaments()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Tournaments', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            gameType: 'BBBBBB',
            description: 'BBBBBB',
            maxParticipants: 1,
            currentParticipants: 1,
            startDate: currentDate.format(DATE_TIME_FORMAT),
            tournamentLogo: 'BBBBBB',
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Tournaments', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            gameType: 'BBBBBB',
            description: 'BBBBBB',
            maxParticipants: 1,
            currentParticipants: 1,
            startDate: currentDate.format(DATE_TIME_FORMAT),
            tournamentLogo: 'BBBBBB',
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Tournaments', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

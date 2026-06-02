import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Flights } from './flights';
import { FlightStatus } from '../models/flight.type';

const BASE_URL = 'http://api.aviationstack.com/v1/flights';
const API_KEY = 'a926a406be08a97981c6e5241f44436d';

const mockAviationStackFlight = {
  flight_status: 'active',
  departure: { iata: 'JFK', scheduled: '2026-05-26T08:00:00Z' },
  arrival: { iata: 'LAX', scheduled: '2026-05-26T11:30:00Z' },
  flight: { iata: 'AA100' },
};

const mockAviationStackResponse = {
  data: [mockAviationStackFlight],
};

describe('Flights Service', () => {
  let service: Flights;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), Flights],
    });
    service = TestBed.inject(Flights);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('service instantiation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getFlightsByRoute()', () => {
    it('should fetch flights by route', () => {
      return new Promise<void>((resolve) => {
        service.getFlightsByRoute('JFK', 'LAX', 'AA').subscribe((flights) => {
          expect(flights).toHaveLength(1);
          expect(flights[0].flightNumber).toBe('AA100');
          expect(flights[0].origin).toBe('JFK');
          resolve();
        });

        const req = httpMock.expectOne((request) =>
          request.url === BASE_URL &&
          request.params.get('dep_iata') === 'JFK' &&
          request.params.get('arr_iata') === 'LAX' &&
          request.params.get('airline_iata') === 'AA' &&
          request.params.get('access_key') === API_KEY
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockAviationStackResponse);
      });
    });

    it('should map multiple flights correctly', () => {
      const multiFlightResponse = {
        data: [
          { ...mockAviationStackFlight, flight: { iata: 'AA100' } },
          { ...mockAviationStackFlight, flight: { iata: 'UA200' }, flight_status: 'landed' },
          { ...mockAviationStackFlight, flight: { iata: 'DL300' }, flight_status: 'cancelled' },
        ],
      };

      return new Promise<void>((resolve) => {
        service.getFlightsByRoute('ORD', 'MIA', 'UA').subscribe((flights) => {
          expect(flights).toHaveLength(3);
          expect(flights[0].flightNumber).toBe('AA100');
          expect(flights[1].flightNumber).toBe('UA200');
          expect(flights[1].status).toBe(FlightStatus.Arrived);
          expect(flights[2].flightNumber).toBe('DL300');
          expect(flights[2].status).toBe(FlightStatus.Cancelled);
          resolve();
        });

        const req = httpMock.expectOne((request) => request.url === BASE_URL);
        req.flush(multiFlightResponse);
      });
    });

    it('should handle empty response', () => {
      return new Promise<void>((resolve) => {
        service.getFlightsByRoute('SFO', 'SEA', 'SW').subscribe((flights) => {
          expect(flights).toHaveLength(0);
          resolve();
        });

        const req = httpMock.expectOne((request) => request.url === BASE_URL);
        req.flush({ data: [] });
      });
    });
  });

  describe('getFlightByFlightNumber()', () => {
    it('should fetch an array of flights by flight number', () => {
      return new Promise<void>((resolve) => {
        service.getFlightByFlightNumber('AA100').subscribe((flights) => {
          expect(flights[0].flightNumber).toBe('AA100');
          expect(flights[0].origin).toBe('JFK');
          expect(flights[0].destination).toBe('LAX');
          resolve();
        });

        const req = httpMock.expectOne((request) =>
          request.url === BASE_URL &&
          request.params.get('flight_iata') === 'AA100' &&
          request.params.get('access_key') === API_KEY
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockAviationStackResponse);
      });
    });

    it('should return the first flight from the response', () => {
      const responseWithMultiple = {
        data: [
          { ...mockAviationStackFlight, flight: { iata: 'AA100' } },
          { ...mockAviationStackFlight, flight: { iata: 'AA200' } },
        ],
      };

      return new Promise<void>((resolve) => {
        service.getFlightByFlightNumber('AA100').subscribe((flights) => {
          expect(flights[0].flightNumber).toBe('AA100');
          resolve();
        });

        const req = httpMock.expectOne((request) => request.url === BASE_URL);
        req.flush(responseWithMultiple);
      });
    });

    it('should map all flight properties correctly', () => {
      return new Promise<void>((resolve) => {
        service.getFlightByFlightNumber('UA999').subscribe((flights) => {
          expect(flights[0].flightNumber).toBe('AA100');
          expect(flights[0].origin).toBe('JFK');
          expect(flights[0].destination).toBe('LAX');
          expect(flights[0].departureTime).toBe('2026-05-26T08:00:00Z');
          expect(flights[0].arrivalTime).toBe('2026-05-26T11:30:00Z');
          expect(flights[0].status).toBe(FlightStatus.Departed);
          resolve();
        });

        const req = httpMock.expectOne((request) => request.url === BASE_URL);
        req.flush(mockAviationStackResponse);
      });
    });
  });

  describe('status mapping', () => {
    it('should map active status to departed', () => {
      const flight = { ...mockAviationStackFlight, flight_status: 'active' };
      return new Promise<void>((resolve) => {
        service.getFlightByFlightNumber('AA100').subscribe((flights) => {
          expect(flights[0].status).toBe(FlightStatus.Departed);
          resolve();
        });

        const req = httpMock.expectOne((request) => request.url === BASE_URL);
        req.flush({ data: [flight] });
      });
    });

    it('should map landed status to arrived', () => {
      const flight = { ...mockAviationStackFlight, flight_status: 'landed' };
      return new Promise<void>((resolve) => {
        service.getFlightByFlightNumber('AA100').subscribe((flights) => {
          expect(flights[0].status).toBe(FlightStatus.Arrived);
          resolve();
        });

        const req = httpMock.expectOne((request) => request.url === BASE_URL);
        req.flush({ data: [flight] });
      });
    });

    it('should map diverted status to delayed', () => {
      const flight = { ...mockAviationStackFlight, flight_status: 'diverted' };
      return new Promise<void>((resolve) => {
        service.getFlightByFlightNumber('AA100').subscribe((flights) => {
          expect(flights[0].status).toBe(FlightStatus.Delayed);
          resolve();
        });

        const req = httpMock.expectOne((request) => request.url === BASE_URL);
        req.flush({ data: [flight] });
      });
    });

    it('should map cancelled status to cancelled', () => {
      const flight = { ...mockAviationStackFlight, flight_status: 'cancelled' };
      return new Promise<void>((resolve) => {
        service.getFlightByFlightNumber('AA100').subscribe((flights) => {
          expect(flights[0].status).toBe(FlightStatus.Cancelled);
          resolve();
        });

        const req = httpMock.expectOne((request) => request.url === BASE_URL);
        req.flush({ data: [flight] });
      });
    });

    it('should map unknown status to scheduled', () => {
      const flight = { ...mockAviationStackFlight, flight_status: 'unknown_status' };
      return new Promise<void>((resolve) => {
        service.getFlightByFlightNumber('AA100').subscribe((flights) => {
          expect(flights[0].status).toBe(FlightStatus.Scheduled);
          resolve();
        });

        const req = httpMock.expectOne((request) => request.url === BASE_URL);
        req.flush({ data: [flight] });
      });
    });
  });

  describe('HTTP error handling', () => {
    it('should propagate HTTP 404 errors', () => {
      return new Promise<void>((resolve, reject) => {
        service.getFlightByFlightNumber('INVALID').subscribe(
          () => {
            reject(new Error('should have failed'));
          },
          (error) => {
            expect(error.status).toBe(404);
            resolve();
          }
        );

        const req = httpMock.expectOne((request) => request.url === BASE_URL);
        req.flush('Not found', { status: 404, statusText: 'Not Found' });
      });
    });

    it('should propagate HTTP 500 errors', () => {
      return new Promise<void>((resolve, reject) => {
        service.getFlightsByRoute('JFK', 'LAX', 'AA').subscribe(
          () => {
            reject(new Error('should have failed'));
          },
          (error) => {
            expect(error.status).toBe(500);
            resolve();
          }
        );

        const req = httpMock.expectOne((request) => request.url === BASE_URL);
        req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      });
    });
  });

  describe('Flight transformation', () => {
    it('should transform all AviationStack properties to Flight model', () => {
      const mockResponse = {
        data: [
          {
            flight_status: 'active',
            departure: { iata: 'SFO', scheduled: '2026-05-26T10:00:00Z' },
            arrival: { iata: 'NYC', scheduled: '2026-05-26T18:00:00Z' },
            flight: { iata: 'SW999' },
          },
        ],
      };

      return new Promise<void>((resolve) => {
        service.getFlightsByRoute('SFO', 'NYC', 'SW').subscribe((flights) => {
          const flight = flights[0];
          expect(flight).toEqual({
            flightNumber: 'SW999',
            origin: 'SFO',
            destination: 'NYC',
            departureTime: '2026-05-26T10:00:00Z',
            arrivalTime: '2026-05-26T18:00:00Z',
            status: FlightStatus.Departed,
          });
          resolve();
        });

        const req = httpMock.expectOne((request) => request.url === BASE_URL);
        req.flush(mockResponse);
      });
    });
  });
});

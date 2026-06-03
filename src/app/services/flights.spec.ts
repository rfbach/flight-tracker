import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { mockApiInterceptor } from '../interceptors/mock-api.interceptor';
import { FlightStatus } from '../models/flight.type';
import { Flights } from './flights';

describe('Flights Service', () => {
  let service: Flights;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([mockApiInterceptor])), Flights],
    });
    service = TestBed.inject(Flights);
  });

  describe('service instantiation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getFlightsByRoute()', () => {
    it('should fetch flights by route using mock data', async () => {
      const result = await service.getFlightsByRoute('JFK', 'LAX', null).toPromise();
      expect(result).toHaveProperty('flights');
      expect(result).toHaveProperty('hasMore');
      expect(Array.isArray(result?.flights)).toBe(true);
      
      // Should return AA100 based on mock data
      expect(result?.flights.length).toBeGreaterThan(0);
      const flight = result!.flights[0];
      expect(flight.flightNumber).toBe('AA100');
      expect(flight.departureAirport).toBe('JFK');
      expect(flight.arrivalAirport).toBe('LAX');
      expect(flight.status).toBe(FlightStatus.Departed);
    });

    it('should filter flights by route correctly', async () => {
      const result = await service.getFlightsByRoute('SEA', 'ORD', null).toPromise();
      const seaToOrdFlights = result!.flights.filter(
        (f) => f.departureAirport === 'SEA' && f.arrivalAirport === 'ORD'
      );
      expect(seaToOrdFlights.length).toBeGreaterThan(0);
      seaToOrdFlights.forEach((flight) => {
        expect(flight.departureAirport).toBe('SEA');
        expect(flight.arrivalAirport).toBe('ORD');
      });
    });

    it('should map flight status correctly', async () => {
      const result = await service.getFlightsByRoute('SEA', 'ORD', null).toPromise();
      const flights = result!.flights;
      
      // Check that at least some flights have the correct statuses
      const statusSet = new Set(flights.map((f) => f.status));
      expect(statusSet.size).toBeGreaterThan(0);
      expect([FlightStatus.Scheduled, FlightStatus.Departed, FlightStatus.Arrived, FlightStatus.Cancelled]).toEqual(
        expect.arrayContaining(Array.from(statusSet))
      );
    });

    it('should handle empty results', async () => {
      // Request route that doesn't exist in mock data
      const result = await service.getFlightsByRoute('XYZ', 'ABC', null).toPromise();
      expect(Array.isArray(result?.flights)).toBe(true);
      expect(result?.flights.length).toBe(0);
    });
  });

  describe('getFlightByFlightNumber()', () => {
    it('should fetch a single flight by number using mock data', async () => {
      const flights = await service.getFlightByFlightNumber('AA100').toPromise();
      expect(Array.isArray(flights)).toBe(true);
      expect(flights!.length).toBeGreaterThan(0);
      expect(flights![0].flightNumber).toBe('AA100');
      expect(flights![0].departureAirport).toBe('JFK');
      expect(flights![0].arrivalAirport).toBe('LAX');
    });

    it('should return empty array for non-existent flight', async () => {
      const flights = await service.getFlightByFlightNumber('ZZ999').toPromise();
      expect(Array.isArray(flights)).toBe(true);
      expect(flights!.length).toBe(0);
    });

    it('should handle case-insensitive flight numbers', async () => {
      const flights = await service.getFlightByFlightNumber('aa100').toPromise();
      expect(flights!.length).toBeGreaterThan(0);
      expect(flights![0].flightNumber).toBe('AA100');
    });

    it('should map all flight properties correctly', async () => {
      const flights = await service.getFlightByFlightNumber('AA100').toPromise();
      const flight = flights![0];
      expect(flight).toHaveProperty('flightNumber');
      expect(flight).toHaveProperty('departureAirport');
      expect(flight).toHaveProperty('arrivalAirport');
      expect(flight).toHaveProperty('scheduledDepartureTime');
      expect(flight).toHaveProperty('estimatedDepartureTime');
      expect(flight).toHaveProperty('actualDepartureTime');
      expect(flight).toHaveProperty('scheduledArrivalTime');
      expect(flight).toHaveProperty('estimatedArrivalTime');
      expect(flight).toHaveProperty('actualArrivalTime');
      expect(flight).toHaveProperty('durationMinutes');
      expect(flight).toHaveProperty('departureDelayMinutes');
      expect(flight).toHaveProperty('arrivalDelayMinutes');
      expect(flight).toHaveProperty('status');
      expect(flight).toHaveProperty('csFlightNumber');
    });
  });
});

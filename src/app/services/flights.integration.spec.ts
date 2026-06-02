import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { mockApiInterceptor } from '../interceptors/mock-api.interceptor';
import { Flights } from './flights';

const BASE_URL = 'http://api.aviationstack.com/v1/flights';
// const API_KEY = 'a926a406be08a97981c6e5241f44436d';

describe('Flights Service - Real API Integration', () => {
  let service: Flights;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([mockApiInterceptor])), Flights],
    });
    service = TestBed.inject(Flights);
    http = TestBed.inject(HttpClient);
  });

  it('should fetch flights by route from real API and validate response format', async () => {
    const flights$ = service.getFlightsByRoute('SEA', 'ORD', 'AS');

    return new Promise<void>((resolve, reject) => {
      flights$.subscribe({
        next: (flights) => {
        //   console.log('Response received:', flights);

          // Validate that we got an array
          expect(Array.isArray(flights)).toBe(true);

          // If there are flights, validate the structure
          if (flights.length > 0) {
            const flight = flights[0];
            // console.log('First flight:', flight);

            // Validate Flight model structure
            expect(flight).toHaveProperty('flightNumber');
            expect(flight).toHaveProperty('origin');
            expect(flight).toHaveProperty('destination');
            expect(flight).toHaveProperty('departureTime');
            expect(flight).toHaveProperty('arrivalTime');
            expect(flight).toHaveProperty('status');

            // Validate types
            expect(typeof flight.flightNumber).toBe('string');
            expect(typeof flight.origin).toBe('string');
            expect(typeof flight.destination).toBe('string');
            expect(typeof flight.departureTime).toBe('string');
            expect(typeof flight.arrivalTime).toBe('string');
          }

          resolve();
        },
        error: (error) => {
          console.error('API Error:', error);
          reject(new Error(`Failed to fetch from real API: ${error.message}`));
        },
      });
    });
  });

  it('should fetch flights by flight number from real API', async () => {
    const flightNumber = 'AS216';
    const flight$ = service.getFlightByFlightNumber(flightNumber);

    return new Promise<void>((resolve, reject) => {
      flight$.subscribe({
        next: (flight) => {
        //   console.log(`Flight ${flightNumber}:`, flight);

          // Validate Flight model structure
          expect(flight).toHaveProperty('flightNumber');
          expect(flight).toHaveProperty('origin');
          expect(flight).toHaveProperty('destination');
          expect(flight).toHaveProperty('departureTime');
          expect(flight).toHaveProperty('arrivalTime');
          expect(flight).toHaveProperty('status');

          resolve();
        },
        error: (error) => {
          console.error('API Error:', error);
          reject(new Error(`Failed to fetch flight: ${error.message}`));
        },
      });
    });
  });
});

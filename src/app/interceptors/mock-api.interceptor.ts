import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MOCK_FLIGHTS } from '../testing/mock-flights.data';

/**
 * DEV-ONLY interceptor — intercepts requests to aviationstack.com and returns
 * local mock data so you don't burn free-tier API quota during development.
 *
 * Remove `mockApiInterceptor` from `provideHttpClient()` in app.config.ts
 * before deploying to production.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('aviationstack.com')) {
    return next(req);
  }

  const flightIata = req.params.get('flight_iata')?.toUpperCase();
  const depIata    = req.params.get('dep_iata')?.toUpperCase();
  const arrIata    = req.params.get('arr_iata')?.toUpperCase();

  let data = MOCK_FLIGHTS;
  if (flightIata) data = data.filter((f) => f.flight.iata    === flightIata);
  if (depIata)    data = data.filter((f) => f.departure.iata === depIata);
  if (arrIata)    data = data.filter((f) => f.arrival.iata   === arrIata);

  return of(new HttpResponse({ status: 200, body: { data } }));
};

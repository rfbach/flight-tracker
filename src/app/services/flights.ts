import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Flight, FlightStatus } from '../models/flight.type';

// Sign up for a free API key at https://aviationstack.com/
const API_KEY = 'a926a406be08a97981c6e5241f44436d';
const BASE_URL = 'http://api.aviationstack.com/v1/flights';

interface AviationStackFlight {
  flight_status: string;
  departure: { iata: string; scheduled: string };
  arrival: { iata: string; scheduled: string };
  flight: { iata: string };
}

interface AviationStackResponse {
  data: AviationStackFlight[];
  pagination?: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
}

function mapStatus(status: string): FlightStatus {
  switch (status) {
    case 'active':    return FlightStatus.Departed;
    case 'landed':    return FlightStatus.Arrived;
    case 'cancelled': return FlightStatus.Cancelled;
    case 'diverted':  return FlightStatus.Delayed;
    default:          return FlightStatus.Scheduled;
  }
}

function toFlight(f: AviationStackFlight): Flight {
  return {
    flightNumber:  f.flight.iata,
    origin:        f.departure.iata,
    destination:   f.arrival.iata,
    departureTime: f.departure.scheduled,
    arrivalTime:   f.arrival.scheduled,
    status:        mapStatus(f.flight_status),
  };
}

@Injectable({
  providedIn: 'root',
})
export class Flights {
  readonly #http = inject(HttpClient);

  /**
   * Fetch flights by route and airline.
   * @param origin      3-letter IATA airport code, e.g. 'JFK'
   * @param destination 3-letter IATA airport code, e.g. 'LAX'
   * @param airline     2-letter IATA airline code, e.g. 'AA'
   */
  getFlightsByRoute(
    origin: string,
    destination: string,
    airline: string,
  ): Observable<Flight[]> {
    let params = new HttpParams()
      .set('access_key', API_KEY)
      .set('dep_iata', origin)
      .set('arr_iata', destination)
      .set('airline_iata', airline);
    return this.#http
      .get<AviationStackResponse>(BASE_URL, { params })
      .pipe(map((res) => res.data.map(toFlight)));
  }

  /**
   * Fetch a single flight by its IATA flight number, e.g. 'AA100'.
   */
  getFlightByFlightNumber(flightNumber: string): Observable<Flight[]> {
    const params = new HttpParams()
      .set('access_key', API_KEY)
      .set('flight_iata', flightNumber.toUpperCase());
    return this.#http
      .get<AviationStackResponse>(BASE_URL, { params })
      .pipe(map((res) => res.data.map(toFlight)));
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Flight, FlightStatus } from '../models/flight.type';

// Sign up for a free API key at https://airlabs.co/
const API_KEY = '6ef2046e-75cd-4cac-bd0a-f82a10b5a4e6';
const BASE_URL = 'https://airlabs.co/api/v9/schedules';

interface AirlabsRequest {
  has_more: boolean;
  total_items: number;
  key: {
    limits_total: number;
  }
}

interface AirlabsFlight {
  flight_iata: string;
  dep_iata: string;
  arr_iata: string;
  dep_time: string;
  dep_time_estimated: string | null;
  dep_time_actual: string | null;
  arr_time: string;
  arr_time_estimated: string | null;
  arr_time_actual: string | null;
  duration: number;
  dep_delay: number | null;
  arr_delay: number | null;
  status: string;
  cs_flight_iata: string | null;
}

interface AirlabsResponse {
  request: AirlabsRequest;
  response: AirlabsFlight[];
}

export interface FlightsResult {
  flights: Flight[];
  hasMore: boolean;
}

function mapStatus(status: string, depDelay: number): FlightStatus {
  switch (status) {
    case 'active':    return FlightStatus.Departed;
    case 'landed':    return FlightStatus.Arrived;
    case 'cancelled': return FlightStatus.Cancelled;
    default:
      if (depDelay > 0) return FlightStatus.Delayed;
      return FlightStatus.Scheduled;
  }
}

function toFlight(f: AirlabsFlight): Flight {
  return {
    flightNumber: f.flight_iata,
    departureAirport: f.dep_iata,
    arrivalAirport: f.arr_iata,
    scheduledDepartureTime: f.dep_time,
    estimatedDepartureTime: f.dep_time_estimated,
    actualDepartureTime: f.dep_time_actual,
    scheduledArrivalTime: f.arr_time,
    estimatedArrivalTime: f.arr_time_estimated,
    actualArrivalTime: f.arr_time_actual,
    durationMinutes: f.duration,
    departureDelayMinutes: f.dep_delay,
    arrivalDelayMinutes: f.arr_delay,
    status: mapStatus(f.status, f.dep_delay ?? 0),
    csFlightNumber: f.cs_flight_iata,
  };
}

@Injectable({
  providedIn: 'root',
})
export class Flights {
  readonly #http = inject(HttpClient);

  /**
   * Fetch flights by route and airline.
   * @param departureAirport      3-letter IATA airport code, e.g. 'JFK'
   * @param arrivalAirport        3-letter IATA airport code, e.g. 'LAX'
   * @param airline               2-letter IATA airline code, e.g. 'AA'
   */
  getFlightsByRoute(
    departureAirport: string,
    arrivalAirport: string,
    airline: string | null,
  ): Observable<FlightsResult> {
    let params = new HttpParams()
      .set('api_key', API_KEY)
      .set('dep_iata', departureAirport)
      .set('arr_iata', arrivalAirport);
    if (airline) {
      params = params.set('airline_iata', airline);
    }
    return this.#http
      .get<AirlabsResponse>(BASE_URL, { params })
      .pipe(
        tap((res) => {
          console.log('Remaining requests:', res.request.key.limits_total);
          console.log('API response:', res);
        }),
        map((res) => ({
          flights: res.response.map(toFlight),
          hasMore: res.request.has_more,
        })),
      );
  }

  /**
   * Fetch a single flight by its IATA flight number, e.g. 'AA100'.
   */
  getFlightByFlightNumber(flightNumber: string): Observable<Flight[]> {
    const params = new HttpParams()
      .set('api_key', API_KEY)
      .set('flight_iata', flightNumber.toUpperCase());
    return this.#http
      .get<AirlabsResponse>(BASE_URL, { params })
      .pipe(
        tap((res) => {
          console.log('Remaining requests:', res.request.key.limits_total);
          console.log('API response:', res);
        }),
        map((res) => res.response.map(toFlight))
      );
  }
}

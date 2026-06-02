/**
 * Mock AviationStack API response shapes used by the dev interceptor.
 * Add or edit entries here to test different UI states.
 */
export const MOCK_FLIGHTS = [
  {
    flight_status: 'active',
    departure: { iata: 'JFK', scheduled: '2026-05-26T08:00:00+00:00' },
    arrival:   { iata: 'LAX', scheduled: '2026-05-26T11:30:00+00:00' },
    flight:    { iata: 'AA100' },
  },
  {
    flight_status: 'scheduled',
    departure: { iata: 'JFK', scheduled: '2026-05-26T14:00:00+00:00' },
    arrival:   { iata: 'ORD', scheduled: '2026-05-26T16:10:00+00:00' },
    flight:    { iata: 'UA202' },
  },
  {
    flight_status: 'cancelled',
    departure: { iata: 'JFK', scheduled: '2026-05-26T18:30:00+00:00' },
    arrival:   { iata: 'MIA', scheduled: '2026-05-26T21:45:00+00:00' },
    flight:    { iata: 'DL305' },
  },
  {
    flight_status: 'landed',
    departure: { iata: 'LAX', scheduled: '2026-05-26T06:00:00+00:00' },
    arrival:   { iata: 'JFK', scheduled: '2026-05-26T14:20:00+00:00' },
    flight:    { iata: 'AA101' },
  },
  {
    flight_status: 'diverted',
    departure: { iata: 'ORD', scheduled: '2026-05-26T09:15:00+00:00' },
    arrival:   { iata: 'BOS', scheduled: '2026-05-26T12:30:00+00:00' },
    flight:    { iata: 'UA550' },
  },
  {
    flight_status: 'scheduled',
    departure: { iata: 'MIA', scheduled: '2026-05-26T20:00:00+00:00' },
    arrival:   { iata: 'LAX', scheduled: '2026-05-26T23:30:00+00:00' },
    flight:    { iata: 'AA999' },
  },
  {
    flight_status: 'active',
    departure: { iata: 'SEA', scheduled: '2026-05-26T12:00:00+00:00' },
    arrival:   { iata: 'CLE', scheduled: '2026-05-26T18:00:00+00:00' },
    flight:    { iata: 'AS216' },
  },
  {
    flight_status: 'scheduled',
    departure: { iata: 'SEA', scheduled: '2026-05-26T15:00:00+00:00' },
    arrival:   { iata: 'ORD', scheduled: '2026-05-26T21:30:00+00:00' },
    flight:    { iata: 'AS100' },
  },
  {
    flight_status: 'cancelled',
    departure: { iata: 'SEA', scheduled: '2026-05-26T18:00:00+00:00' },
    arrival:   { iata: 'ORD', scheduled: '2026-05-26T21:30:00+00:00' },
    flight:    { iata: 'AS200' },
  }
];

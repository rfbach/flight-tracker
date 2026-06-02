# Flight Tracker — Page Requirements

## Goal
A single-page Angular application that displays information about a flight fetched from an HTTP API.

---

## Tech Stack
- **Framework:** Angular 21 (standalone components, signals)
- **HTTP:** `HttpClient` via `provideHttpClient()` (already registered in `app.config.ts`)
- **Routing:** Angular Router (`@angular/router`)
- **Language:** TypeScript

---

## Data Model

Defined in `src/app/models/flight.type.ts`:

```ts
export type Flight = {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;  // ISO 8601 string
  arrivalTime: string;    // ISO 8601 string
  status: 'scheduled' | 'delayed' | 'cancelled' | 'departed' | 'arrived';
};
```

---

## Service

`src/app/services/flights.ts` — `Flights` injectable service.

- `getFlights()` — GET `/api/flights` (placeholder; replace with the real endpoint)
- Should return `Observable<Flight>` typed against the `Flight` model
- A method to fetch a **single flight by ID** still needs to be added: `getFlightById(id: string): Observable<Flight>`

---

## Routing

- Root path (`/`) — `AppComponent` shell (heading + `<router-outlet>`)
- `/flight/:id` — `FlightDetailComponent` (to be created)
  - Reads the `id` route param
  - Calls `FlightsService.getFlightById(id)`
  - Displays the flight data or a loading/error state

Route must be registered in `src/app/app.routes.ts`.

---

## Pages / Components

### AppComponent (`src/app/app.ts`)
- Already exists; renders a heading and `<router-outlet>`
- `app.html` needs `<router-outlet>` added

### FlightDetailComponent (to be created: `src/app/flight-detail/`)
Displays all fields of the `Flight` model:

| Field | Display label |
|---|---|
| `flightNumber` | Flight Number |
| `origin` | Origin |
| `destination` | Destination |
| `departureTime` | Departure |
| `arrivalTime` | Arrival |
| `status` | Status |

**UI states to handle:**
- **Loading** — while the HTTP request is in flight
- **Error** — if the request fails
- **Loaded** — render all flight fields

---

## What Is Already Done
- `Flight` type defined
- `Flights` service scaffolded with `HttpClient` injected
- `provideHttpClient()` registered in `app.config.ts`
- `provideRouter(routes)` registered in `app.config.ts`

## What Still Needs To Be Built
1. Add `getFlightById(id: string): Observable<Flight>` to `FlightsService`
2. Create `FlightDetailComponent` (component class + template)
3. Register `/flight/:id` route in `app.routes.ts`
4. Add `<router-outlet>` to `app.html`
5. Replace the `/api/flights` placeholder URL with the real API endpoint

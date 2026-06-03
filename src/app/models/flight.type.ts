export enum FlightStatus {
  Scheduled = 'scheduled',
  Cancelled = 'cancelled',
  Departed = 'departed',
  Arrived = 'arrived',
}

export type Flight = {
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDepartureTime: string;
  estimatedDepartureTime: string | null;
  actualDepartureTime: string | null;
  scheduledArrivalTime: string;
  estimatedArrivalTime: string | null;
  actualArrivalTime: string | null;
  durationMinutes: number;
  departureDelayMinutes: number | null;
  arrivalDelayMinutes: number | null;
  status: FlightStatus;
  csFlightNumber: string | null;
};
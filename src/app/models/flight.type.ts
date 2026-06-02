export enum FlightStatus {
  Scheduled = 'scheduled',
  Delayed = 'delayed',
  Cancelled = 'cancelled',
  Departed = 'departed',
  Arrived = 'arrived',
}

export type Flight = {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: FlightStatus;
};
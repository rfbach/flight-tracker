import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight, FlightStatus } from '../../models/flight.type';
import { Airline } from '../search-container/search-container';

@Component({
  selector: 'app-results-list',
  imports: [CommonModule],
  templateUrl: './results-list.html',
  styleUrl: './results-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class resultsList {
  searchResults = input<Array<Flight>>([]);
  hasSearched = input(false);
  isLoading = input(false);
  airlines = input<Array<Airline>>([]);

  formatStatus(status: Flight['status']): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getDepartureTime(flight: Flight): string {
    return flight.actualDepartureTime || flight.estimatedDepartureTime || flight.scheduledDepartureTime;
  }

  getArrivalTime(flight: Flight): string {
    return flight.actualArrivalTime || flight.estimatedArrivalTime || flight.scheduledArrivalTime;
  }

  getDepartureTimeType(flight: Flight): 'actual' | 'estimated' | 'scheduled' {
    if (flight.actualDepartureTime) return 'actual';
    if (flight.estimatedDepartureTime) return 'estimated';
    return 'scheduled';
  }

  getArrivalTimeType(flight: Flight): 'actual' | 'estimated' | 'scheduled' {
    if (flight.actualArrivalTime) return 'actual';
    if (flight.estimatedArrivalTime) return 'estimated';
    return 'scheduled';
  }

  hasDelayInfo(flight: Flight): boolean {
    return (flight.departureDelayMinutes ?? 0) > 0 || (flight.arrivalDelayMinutes ?? 0) > 0;
  }

  getDelayMessage(flight: Flight): string {
    const messages: string[] = [];
    
    if ((flight.departureDelayMinutes ?? 0) > 0) {
      messages.push(`Departure delayed ${flight.departureDelayMinutes} minutes`);
    }
    
    if ((flight.arrivalDelayMinutes ?? 0) > 0) {
      messages.push(`Arrival delayed ${flight.arrivalDelayMinutes} minutes`);
    }
    
    return messages.join(' | ');
  }

  showDelayIndicator(flight: Flight): boolean {
    return this.hasDelayInfo(flight);
  }

  isDepartureEarlyOrOnTime(flight: Flight): boolean {
    const currentTime = new Date(flight.actualDepartureTime || flight.estimatedDepartureTime || '');
    const scheduledTime = new Date(flight.scheduledDepartureTime);
    return currentTime.getTime() <= scheduledTime.getTime();
  }

  isArrivalEarlyOrOnTime(flight: Flight): boolean {
    const currentTime = new Date(flight.actualArrivalTime || flight.estimatedArrivalTime || '');
    const scheduledTime = new Date(flight.scheduledArrivalTime);
    return currentTime.getTime() <= scheduledTime.getTime();
  }

  getAirlineCode(flightNumber: string): string {
    return flightNumber.substring(0, 2);
  }

  getAirlineName(flightNumber: string): string | undefined {
    const code = this.getAirlineCode(flightNumber);
    return this.airlines().find(a => a.code === code)?.name;
  }
}

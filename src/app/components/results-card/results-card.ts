import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight, FlightStatus } from '../../models/flight.type';

@Component({
  selector: 'app-results-card',
  imports: [CommonModule],
  templateUrl: './results-card.html',
  styleUrl: './results-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsCard {
  searchResults = input<Array<Flight>>([]);
  hasSearched = input(false);

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
      messages.push(`Dep: +${flight.departureDelayMinutes} min`);
    }
    
    if ((flight.arrivalDelayMinutes ?? 0) > 0) {
      messages.push(`Arr: +${flight.arrivalDelayMinutes} min`);
    }
    
    return messages.join(' | ');
  }

  showDelayIndicator(flight: Flight): boolean {
    return flight.status !== FlightStatus.Delayed && this.hasDelayInfo(flight);
  }
}

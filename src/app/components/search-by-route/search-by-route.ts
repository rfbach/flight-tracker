import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Flight } from '../../models/flight.type';
import { Flights } from '../../services/flights';

@Component({
  selector: 'app-search-by-route',
  imports: [],
  templateUrl: './search-by-route.html',
  styleUrl: './search-by-route.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchByRoute {
  private readonly flightsService = inject(Flights);
  searchResults = signal<Array<Flight>>([]);
  hasSearched = signal(false);

  searchByRoute(origin: string, destination: string, airline: string): void {
    const originQuery = origin.trim();
    const destinationQuery = destination.trim();
    const airlineQuery = airline.trim();

    this.hasSearched.set(true);

    if (!originQuery && !destinationQuery && !airlineQuery) {
      this.searchResults.set([]);
      return;
    }

    this.flightsService.getFlightsByRoute(originQuery, destinationQuery, airlineQuery).subscribe({
      next: (flights) => {
        this.searchResults.set(flights);
      },
      error: (error) => {
        console.error('Error fetching flights:', error);
        this.searchResults.set([]);
      },
    });
  }

  formatStatus(status: Flight['status']): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Flights } from '../../services/flights';
import { Flight } from '../../models/flight.type';

@Component({
  selector: 'app-search-by-flight-number',
  imports: [],
  templateUrl: './search-by-flight-number.html',
  styleUrl: './search-by-flight-number.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchByFlightNumber {
  private readonly flightsService = inject(Flights);
  searchResults = signal<Array<Flight>>([]);
  hasSearched = signal(false);

  searchByFlightNumber(flightNumber: string): void {
    const query = flightNumber.trim();
    this.hasSearched.set(true);

    if (!query) {
      this.searchResults.set([]);
      return;
    }

    this.flightsService.getFlightByFlightNumber(query).subscribe({
      next: (flights) => {
        this.searchResults.set(flights);
      },
      error: (error) => {
        console.error('Error fetching flight:', error);
        this.searchResults.set([]);
      },
    });
  }

  formatStatus(status: Flight['status']): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

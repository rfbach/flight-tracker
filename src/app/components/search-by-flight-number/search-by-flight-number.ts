import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Flights } from '../../services/flights';
import { Flight } from '../../models/flight.type';
import { resultsList } from '../results-list/results-list';
import { Airline } from '../search-container/search-container';

@Component({
  selector: 'app-search-by-flight-number',
  imports: [resultsList],
  templateUrl: './search-by-flight-number.html',
  styleUrl: './search-by-flight-number.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchByFlightNumber {
  private readonly flightsService = inject(Flights);
  searchResults = signal<Array<Flight>>([]);
  hasSearched = signal(false);
  isLoading = signal(false);
  airlines = input<Array<Airline>>([]);

  searchByFlightNumber(flightNumber: string): void {
    const query = flightNumber.trim();
    this.hasSearched.set(true);

    if (!query) {
      this.searchResults.set([]);
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.flightsService.getFlightByFlightNumber(query).subscribe({
      next: (flights) => {
        this.searchResults.set(flights          
          .sort((a, b) => {
            return new Date(a.scheduledDepartureTime).getTime() - new Date(b.scheduledDepartureTime).getTime();
          })
        );
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching flight:', error);
        this.searchResults.set([]);
        this.isLoading.set(false);
      },
    });
  }
}

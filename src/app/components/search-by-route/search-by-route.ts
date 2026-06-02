import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Flight } from '../../models/flight.type';
import { Flights } from '../../services/flights';
import { ResultsCard } from '../results-card/results-card';

@Component({
  selector: 'app-search-by-route',
  imports: [ResultsCard],
  templateUrl: './search-by-route.html',
  styleUrl: './search-by-route.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchByRoute {
  private readonly flightsService = inject(Flights);
  searchResults = signal<Array<Flight>>([]);
  hasSearched = signal(false);
  hasMoreResults = signal(false);

  searchByRoute(departureAirport: string, arrivalAirport: string, airline: string): void {
    const departureAirportQuery = departureAirport.trim();
    const arrivalAirportQuery = arrivalAirport.trim();
    const airlineQuery = airline.trim() === '' ? null : airline.trim();

    this.hasSearched.set(true);

    if (!departureAirportQuery && !arrivalAirportQuery) {
      this.searchResults.set([]);
      this.hasMoreResults.set(false);
      return;
    }

    this.flightsService.getFlightsByRoute(departureAirportQuery, arrivalAirportQuery, airlineQuery).subscribe({
      next: (flightsResult) => {
        this.searchResults.set(flightsResult.flights
          // Filter out flights that have a csFlightNumber, as those are codeshare duplicates
          .filter(flight => {return flight.csFlightNumber === null;})
          // Sort by scheduled departure time
          .sort((a, b) => {
            return new Date(a.scheduledDepartureTime).getTime() - new Date(b.scheduledDepartureTime).getTime();
          })
        );
        this.hasMoreResults.set(flightsResult.hasMore);
      },
      error: (error) => {
        console.error('Error fetching flights:', error);
        this.searchResults.set([]);
        this.hasMoreResults.set(false);
      },
    });
  }
}

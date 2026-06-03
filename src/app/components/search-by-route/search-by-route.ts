import { ChangeDetectionStrategy, Component, inject, input, signal, computed } from '@angular/core';
import { Flight } from '../../models/flight.type';
import { Flights } from '../../services/flights';
import { resultsList } from '../results-list/results-list';
import { Airline } from '../search-container/search-container';

@Component({
  selector: 'app-search-by-route',
  imports: [resultsList],
  templateUrl: './search-by-route.html',
  styleUrl: './search-by-route.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchByRoute {
  private readonly flightsService = inject(Flights);
  searchResults = signal<Array<Flight>>([]);
  hasSearched = signal(false);
  isLoading = signal(false);
  hasMoreResults = signal(false);
  airlines = input<Array<Airline>>([]);

  private readonly majorAirlineCodes = computed(() => new Set(this.airlines().map(a => a.code)));

  private getAirlineCode(flightNumber: string): string {
    return flightNumber.substring(0, 2);
  }

  private isMajorAirline(flightNumber: string): boolean {
    return this.majorAirlineCodes().has(this.getAirlineCode(flightNumber));
  }

  private filterFlights(flights: Flight[]): Flight[] {
    // Build a dictionary grouping flights by estimated departure/arrival time combo
    const flightsByTimeCombo = new Map<string, Flight[]>();

    for (const flight of flights) {
      const key = `${flight.estimatedDepartureTime}|${flight.estimatedArrivalTime}`;
      if (!flightsByTimeCombo.has(key)) {
        flightsByTimeCombo.set(key, []);
      }
      flightsByTimeCombo.get(key)!.push(flight);
    }

    // For each time combo, return the first flight that has a major airline code
    const resultFlights: Flight[] = [];
    for (const [, flightsForTimeCombo] of flightsByTimeCombo) {
      const majorAirlineFlight = flightsForTimeCombo.find(f => this.isMajorAirline(f.flightNumber));
      if (majorAirlineFlight) {
        resultFlights.push(majorAirlineFlight);
      } else {
        // If no major airline flight, take the first one
        resultFlights.push(flightsForTimeCombo[0]);
      }
    }

    return resultFlights;
  }

  searchByRoute(departureAirport: string, arrivalAirport: string, airline: string): void {
    const departureAirportQuery = departureAirport.trim();
    const arrivalAirportQuery = arrivalAirport.trim();
    const airlineQuery = airline.trim() === '' ? null : airline.trim();

    this.hasSearched.set(true);

    if (!departureAirportQuery && !arrivalAirportQuery) {
      this.searchResults.set([]);
      this.hasMoreResults.set(false);
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.flightsService.getFlightsByRoute(departureAirportQuery, arrivalAirportQuery, airlineQuery).subscribe({
      next: (flightsResult) => {
        this.searchResults.set(this.filterFlights(flightsResult.flights)
          // Sort by scheduled departure time
          .sort((a, b) => {
            return new Date(a.scheduledDepartureTime).getTime() - new Date(b.scheduledDepartureTime).getTime();
          })
        );
        this.hasMoreResults.set(flightsResult.hasMore);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching flights:', error);
        this.searchResults.set([]);
        this.hasMoreResults.set(false);
        this.isLoading.set(false);
      },
    });
  }
}

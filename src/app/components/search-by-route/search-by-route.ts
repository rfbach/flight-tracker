import { Component, inject, signal } from '@angular/core';
import { Flight } from '../../models/flight.type';
import { Flights } from '../../services/flights';

@Component({
  selector: 'app-search-by-route',
  imports: [],
  templateUrl: './search-by-route.html',
  styleUrl: './search-by-route.css',
})
export class SearchByRoute {
  flightsService = inject(Flights);
  searchResults = signal<Array<Flight>>([]);

  searchByRoute(origin: string, destination: string, airline: string) {
    this.flightsService.getFlightsByRoute(origin, destination, airline).subscribe({
      next: (flights) => {
        this.searchResults.set(flights);
      },
      error: (error) => {
        console.error('Error fetching flights:', error);
        this.searchResults.set([]);
      },
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { Flights } from '../../services/flights';
import { Flight } from '../../models/flight.type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-by-flight-number',
  imports: [],
  templateUrl: './search-by-flight-number.html',
  styleUrl: './search-by-flight-number.css',
})
export class SearchByFlightNumber {
  flightsService = inject(Flights);
  searchResults = signal<Array<Flight>>([]);

  searchByFlightNumber(flightNumber: string): void {
    this.flightsService.getFlightByFlightNumber(flightNumber).subscribe({
      next: (flights) => {
        this.searchResults.set(flights);
      },
      error: (error) => {
        console.error('Error fetching flight:', error);
        this.searchResults.set([]);
      },
    });
  }
}

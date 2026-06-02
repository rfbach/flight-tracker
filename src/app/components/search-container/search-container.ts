import { Component } from '@angular/core';
import { SearchByFlightNumber } from "../search-by-flight-number/search-by-flight-number";
import { SearchByRoute } from '../search-by-route/search-by-route';

@Component({
  selector: 'app-search-container',
  imports: [SearchByFlightNumber, SearchByRoute],
  templateUrl: './search-container.html',
  styleUrl: './search-container.css',
})
export class SearchContainer {
  currentTab: 'flightNumber' | 'route' = 'flightNumber';

  switchTab(tab: 'flightNumber' | 'route') {
    this.currentTab = tab;
  }
}

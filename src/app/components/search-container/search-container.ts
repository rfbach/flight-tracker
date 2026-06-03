import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchByFlightNumber } from "../search-by-flight-number/search-by-flight-number";
import { SearchByRoute } from '../search-by-route/search-by-route';

export interface Airline {
  code: string;
  name: string;
}

@Component({
  selector: 'app-search-container',
  imports: [SearchByFlightNumber, SearchByRoute],
  templateUrl: './search-container.html',
  styleUrl: './search-container.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchContainer {
  currentTab: 'flightNumber' | 'route' = 'flightNumber';

  airlines: Airline[] = [
    { code: 'AA', name: 'American Airlines' },
    { code: 'DL', name: 'Delta Air Lines' },
    { code: 'UA', name: 'United Airlines' },
    { code: 'WN', name: 'Southwest Airlines' },
    { code: 'AS', name: 'Alaska Airlines' },
    { code: 'G4', name: 'Allegiant Air' },
    { code: 'F9', name: 'Frontier Airlines' },
    { code: 'HA', name: 'Hawaiian Airlines' },
    { code: 'B6', name: 'JetBlue Airways' },
    { code: 'SY', name: 'Sun Country Airlines' },
  ];

  switchTab(tab: 'flightNumber' | 'route') {
    this.currentTab = tab;
  }
}

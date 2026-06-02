import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByFlightNumber } from './search-by-flight-number';

describe('SearchByFlightNumber', () => {
  let component: SearchByFlightNumber;
  let fixture: ComponentFixture<SearchByFlightNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchByFlightNumber],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchByFlightNumber);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

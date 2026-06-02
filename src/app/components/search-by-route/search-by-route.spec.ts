import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByRoute } from './search-by-route';

describe('SearchByRoute', () => {
  let component: SearchByRoute;
  let fixture: ComponentFixture<SearchByRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchByRoute],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchByRoute);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

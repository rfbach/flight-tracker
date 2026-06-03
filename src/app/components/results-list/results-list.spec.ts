import { ComponentFixture, TestBed } from '@angular/core/testing';
import { resultsList } from './results-list';
import { Flight, FlightStatus } from '../../models/flight.type';

describe('resultsList', () => {
	let component: resultsList;
	let fixture: ComponentFixture<resultsList>;

	const mockFlight: Flight = {
		flightNumber: 'JT305',
		departureAirport: 'SEA',
		arrivalAirport: 'DEN',
		scheduledDepartureTime: '2026-06-02T08:00:00+00:00',
		estimatedDepartureTime: null,
		actualDepartureTime: null,
		scheduledArrivalTime: '2026-06-02T12:30:00+00:00',
		estimatedArrivalTime: null,
		actualArrivalTime: null,
		durationMinutes: 270,
		departureDelayMinutes: null,
		arrivalDelayMinutes: null,
		status: FlightStatus.Scheduled,
		csFlightNumber: null,
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [resultsList],
		}).compileComponents();

		fixture = TestBed.createComponent(resultsList);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should not display results section when hasSearched is false', () => {
		const resultsSection = fixture.nativeElement.querySelector('.results');
		expect(resultsSection).toBeNull();
	});

	it('should display results section when hasSearched is true', () => {
		fixture.componentRef.setInput('hasSearched', true);
		fixture.detectChanges();

		const resultsSection = fixture.nativeElement.querySelector('.results');
		expect(resultsSection).toBeTruthy();
	});

	it('should display empty state when hasSearched is true but searchResults is empty', () => {
		fixture.componentRef.setInput('hasSearched', true);
		fixture.componentRef.setInput('searchResults', []);
		fixture.detectChanges();

		const emptyState = fixture.nativeElement.querySelector('.empty-state');
		expect(emptyState).toBeTruthy();
		expect(emptyState.textContent).toContain('No flights found');
	});

	it('should display flight lists when searchResults has data', () => {
		fixture.componentRef.setInput('hasSearched', true);
		fixture.componentRef.setInput('searchResults', [mockFlight]);
		fixture.detectChanges();

		const flightLists = fixture.nativeElement.querySelectorAll('.flight-list');
		expect(flightLists.length).toBe(1);
	});

	it('should format status correctly', () => {
		expect(component.formatStatus(FlightStatus.Scheduled)).toBe('Scheduled');
		expect(component.formatStatus(FlightStatus.Cancelled)).toBe('Cancelled');
		expect(component.formatStatus(FlightStatus.Arrived)).toBe('Arrived');
	});

	describe('getDepartureTime', () => {
		it('should return actual departure time if available', () => {
			const flight: Flight = {
				...mockFlight,
				actualDepartureTime: '2026-06-02T08:15:00+00:00',
			};

			expect(component.getDepartureTime(flight)).toBe('2026-06-02T08:15:00+00:00');
		});

		it('should return estimated departure time if actual is not available', () => {
			const flight: Flight = {
				...mockFlight,
				estimatedDepartureTime: '2026-06-02T08:10:00+00:00',
			};

			expect(component.getDepartureTime(flight)).toBe('2026-06-02T08:10:00+00:00');
		});

		it('should return scheduled departure time if neither actual nor estimated is available', () => {
			expect(component.getDepartureTime(mockFlight)).toBe(mockFlight.scheduledDepartureTime);
		});
	});

	describe('getArrivalTime', () => {
		it('should return actual arrival time if available', () => {
			const flight: Flight = {
				...mockFlight,
				actualArrivalTime: '2026-06-02T12:45:00+00:00',
			};

			expect(component.getArrivalTime(flight)).toBe('2026-06-02T12:45:00+00:00');
		});

		it('should return estimated arrival time if actual is not available', () => {
			const flight: Flight = {
				...mockFlight,
				estimatedArrivalTime: '2026-06-02T12:40:00+00:00',
			};

			expect(component.getArrivalTime(flight)).toBe('2026-06-02T12:40:00+00:00');
		});

		it('should return scheduled arrival time if neither actual nor estimated is available', () => {
			expect(component.getArrivalTime(mockFlight)).toBe(mockFlight.scheduledArrivalTime);
		});
	});

	describe('getDepartureTimeType', () => {
		it('should return "actual" if actual departure time exists', () => {
			const flight: Flight = {
				...mockFlight,
				actualDepartureTime: '2026-06-02T08:15:00+00:00',
			};

			expect(component.getDepartureTimeType(flight)).toBe('actual');
		});

		it('should return "estimated" if only estimated departure time exists', () => {
			const flight: Flight = {
				...mockFlight,
				estimatedDepartureTime: '2026-06-02T08:10:00+00:00',
			};

			expect(component.getDepartureTimeType(flight)).toBe('estimated');
		});

		it('should return "scheduled" if neither actual nor estimated exists', () => {
			expect(component.getDepartureTimeType(mockFlight)).toBe('scheduled');
		});
	});

	describe('getArrivalTimeType', () => {
		it('should return "actual" if actual arrival time exists', () => {
			const flight: Flight = {
				...mockFlight,
				actualArrivalTime: '2026-06-02T12:45:00+00:00',
			};

			expect(component.getArrivalTimeType(flight)).toBe('actual');
		});

		it('should return "estimated" if only estimated arrival time exists', () => {
			const flight: Flight = {
				...mockFlight,
				estimatedArrivalTime: '2026-06-02T12:40:00+00:00',
			};

			expect(component.getArrivalTimeType(flight)).toBe('estimated');
		});

		it('should return "scheduled" if neither actual nor estimated exists', () => {
			expect(component.getArrivalTimeType(mockFlight)).toBe('scheduled');
		});
	});

	describe('hasDelayInfo', () => {
		it('should return true if departure delay exists', () => {
			const flight: Flight = {
				...mockFlight,
				departureDelayMinutes: 15,
			};

			expect(component.hasDelayInfo(flight)).toBe(true);
		});

		it('should return true if arrival delay exists', () => {
			const flight: Flight = {
				...mockFlight,
				arrivalDelayMinutes: 10,
			};

			expect(component.hasDelayInfo(flight)).toBe(true);
		});

		it('should return false if no delays', () => {
			expect(component.hasDelayInfo(mockFlight)).toBe(false);
		});
	});

	describe('getDelayMessage', () => {
		it('should return departure delay message', () => {
			const flight: Flight = {
				...mockFlight,
				departureDelayMinutes: 15,
			};

			expect(component.getDelayMessage(flight)).toBe('Departure delayed 15 minutes');
		});

		it('should return arrival delay message', () => {
			const flight: Flight = {
				...mockFlight,
				arrivalDelayMinutes: 10,
			};

			expect(component.getDelayMessage(flight)).toBe('Arrival delayed 10 minutes');
		});

		it('should return both delays separated by pipe', () => {
			const flight: Flight = {
				...mockFlight,
				departureDelayMinutes: 15,
				arrivalDelayMinutes: 10,
			};

			expect(component.getDelayMessage(flight)).toBe('Departure delayed 15 minutes | Arrival delayed 10 minutes');
		});

		it('should return empty string if no delays', () => {
			expect(component.getDelayMessage(mockFlight)).toBe('');
		});
	});

	describe('showDelayIndicator', () => {
		it('should return true if status is not delayed but delay minutes exist', () => {
			const flight: Flight = {
				...mockFlight,
				status: FlightStatus.Departed,
				departureDelayMinutes: 15,
			};

			expect(component.showDelayIndicator(flight)).toBe(true);
		});

		it('should return false if no delays', () => {
			expect(component.showDelayIndicator(mockFlight)).toBe(false);
		});
	});
});

import { TestBed } from '@angular/core/testing';

import { AdminGuard } from './adminguard.service';

describe('AdminGuard', () => {
	let guard: AdminGuard;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		guard = TestBed.inject(AdminGuard);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});
});

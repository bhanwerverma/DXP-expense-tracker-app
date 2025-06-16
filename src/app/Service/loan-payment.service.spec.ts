import { TestBed } from '@angular/core/testing';

import { LoanPaymentService } from './loan-payment.service';

describe('LoanPaymentService', () => {
  let service: LoanPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

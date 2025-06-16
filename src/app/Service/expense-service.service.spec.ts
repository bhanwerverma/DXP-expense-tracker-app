import { TestBed } from '@angular/core/testing';

import { ExpenseServiceService } from './expense-service.service';

describe('ExpenseServiceService', () => {
  let service: ExpenseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

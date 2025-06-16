import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTransactionsComponent } from './users-transactions.component';

describe('UsersTransactionsComponent', () => {
  let component: UsersTransactionsComponent;
  let fixture: ComponentFixture<UsersTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

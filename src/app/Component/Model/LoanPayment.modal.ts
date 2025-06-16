// LoanPayment.modal.ts
export interface Loanrepayment {
  id?: number;
  UserId?:number;
  loanId: number;
  emiNumber: number;
  amountPaid: number;
  paymentDate: string;
  status: 'paid'|'active'|'overdue';
}

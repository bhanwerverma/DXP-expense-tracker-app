export interface Loaninterface {
    UserId?:number;
    id?: number;                 // Unique loan ID
    Lender:string;              // Who Provide Loan
    LoanType:string;            // Loan type like presonal Loan/home Loan etc.
    amount: number;            // Total loan amount
    interestRate: number;      // Interest rate in %
    termMonths: number;        // Loan duration in months
    emi: number;               // Calculated monthly EMI
    startDate: string;         // Loan start date (e.g., "2025-06-01")
    dueDate: string;           // Next EMI due date
    status: 'active' | 'paid' | 'overdue'; // Loan status
    remainingAmount?: number;   // Remaining amount to be paid
    repayment?:number[];           // getting payment amount 
    TotalAmounttopay:number     // total amount 
    paidEmis?: number[]
}
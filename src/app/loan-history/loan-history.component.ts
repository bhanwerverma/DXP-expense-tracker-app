import { Component, OnInit } from '@angular/core';
import { Loaninterface } from '../Component/Model/Loan.modal';
import { LoanService } from '../Service/loan.service';
import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { LoanPaymentService } from '../Service/loan-payment.service';
import { Loanrepayment } from '../Component/Model/LoanPayment.modal';
import { ExpenseServiceService } from '../Service/expense-service.service';
import { Expense } from '../Component/Model/Expense.model';


@Component({
  selector: 'app-loan-history',
  imports: [NgFor, NgClass, CurrencyPipe, DatePipe, NgIf],
  templateUrl: './loan-history.component.html',
  styleUrl: './loan-history.component.css'
})
export class LoanHistoryComponent implements OnInit {

  LoanTransactions: Loaninterface[] = []
  selectedLoan: Loaninterface | null = null

  repaymentdata: Loanrepayment[] = []
  RepaymentAmount: { [key: string]: number } = {}

  TransactionData: Expense[] = []
  Balance: number = 0

  Userid :number|null=null;

  constructor(private Loanservice: LoanService, private loanpaymenyservice: LoanPaymentService, private expensedata: ExpenseServiceService) {
    this.fetchdata()
    
  }

  fetchdata() {
    this.expensedata.GetExpense().subscribe((data) => {
      this.TransactionData = data.filter((data)=> data.UserId === this.Userid)

      this.Balance = this.TransactionData.reduce((sum, t) => {
        return t.Type === 'Credit'  
          ? sum + Number(t.Amount)
          : sum - Number(t.Amount);
      }, 0);
      console.log(this.Balance);
      
    });
  }


  ngOnInit(): void {

    this.fetchloginuser()

    this.Loanservice.GetLoan().subscribe((data) => {
      debugger
      this.LoanTransactions = data.filter((data)=> data.UserId === this.Userid);
      this.LoanTransactions.forEach((loan) => {
        const repaymentArr = loan.repayment ?? [];
        if (loan.id !== undefined) {
          this.RepaymentAmount[loan.id] = repaymentArr.reduce((sum, repayment) => sum + Number(repayment), 0);
        }
      });

    });


    this.loanpaymenyservice.getLoanPayment().subscribe((data) => {
      this.repaymentdata = data


    })



  }

  // fetchind logined user data

  fetchloginuser():void{
    const userstr = localStorage.getItem('user');
    const user = userstr ? JSON.parse(userstr) : null;
    console.log(user);
    
    if(user && user.id){
      this.Userid = user.id;
      console.log(this.Userid);
      
    }
  }


  // Show the Payment Modal
  Payment: boolean = false

  // function for open Payment Modal and close
  OpenPayment(id: number) {
    this.selectedLoan = this.LoanTransactions.find((data) => data.id === id) || null
    this.Payment = true
  }

  closePayment() {
    this.Payment = false
    this.selectedLoan = null
  }
  // Get Month Array
  getMonthsArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1)
  }

EMIPayment(emiNumber: number) {
  if (!this.selectedLoan) return;
  debugger
  const loan = this.selectedLoan;

  // Initialize arrays if missing
  loan.repayment = loan.repayment ?? [];
  loan.paidEmis = loan.paidEmis ?? [];

  // Prevent duplicate EMI payment
  if (loan.paidEmis.includes(emiNumber)) {
    alert('This EMI has already been paid.');
    return;
  }

  // Check if enough balance is available
  if (loan.emi > this.Balance) {
    alert('Insufficient balance');
    this.Payment = false
    return;
  }

  // === 1. Update loan local state ===
  loan.paidEmis.push(emiNumber);
  loan.repayment.push(loan.emi);
  loan.remainingAmount =
    Number((loan.remainingAmount ?? loan.TotalAmounttopay).toFixed(2)) - loan.emi;

  // ✅ Calculate total paid correctly (after current EMI is added)
  const totalPaid = loan.repayment.reduce((sum, amt) => sum + Number(amt), 0);

  // ✅ Update status based on full repayment
  const tolerense = 0.01
  loan.status = (loan.TotalAmounttopay - totalPaid) <=tolerense  ? 'paid' : 'active';

  // === 2. Create repayment object ===
  const repayment: Loanrepayment = {
    loanId: loan.id!,
    emiNumber,
    amountPaid: loan.emi,
    paymentDate: new Date().toISOString().slice(0, 10),
    status: 'paid'
  };

  // === 3. Create expense transaction ===
  const transaction: Expense = {
    UserId: this.Userid,
    Transaction_id: loan.id,
    Amount: loan.emi,
    Type: 'Debit',
    Description: loan.LoanType,
    Category: 'Loan EMI / Debt Payments',
    Date: new Date().toISOString().slice(0, 10),
    Time: new Date().toLocaleTimeString()
  };

  // === 4. Save to backend in order ===
  this.expensedata.addexpense(transaction).subscribe(() => {
    this.loanpaymenyservice.addLoanPayment(repayment).subscribe(() => {
      this.Loanservice.UpdateLoan(loan.id!, loan).subscribe(() => {
        alert('Payment Successful');
        this.fetchdata();       // Update balance
        this.Payment = false;
        this.selectedLoan = null;
      });
    });
  });
}




}

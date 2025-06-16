import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LoanService } from '../Service/loan.service';
import { CurrencyPipe, DatePipe, NgFor, NumberSymbol } from '@angular/common';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Loaninterface } from '../Component/Model/Loan.modal';
import { ExpenseServiceService } from '../Service/expense-service.service';
import { Expense } from '../Component/Model/Expense.model';
import { UserLogin } from '../Component/Model/user.modal';

@Component({
  selector: 'app-loan',
  imports: [NgFor, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './loan.component.html',
  styleUrl: './loan.component.css'
})
export class LoanComponent implements OnInit {
  // types of Loans
  LoanType: string[] = [
    'Personal Loan',
    'Home Loan',
    'Education Loan',
    'Vehicle Loan',
    'Business Loan',
    'Gold Loan',
    'Agricultural Loan',
    'Mortgage Loan',
    'Payday Loan',
    'Credit Card Loan'
  ]

  // Loan Lender List
  LoanLender: string[] = [
    'HDFC Bank',
    'ICICI Bank',
    'State Bank of India (SBI)',
    'Punjab National Bank (PNB)',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Bajaj Finserv',
    'IndusInd Bank',
    'IDFC First Bank',
    'LIC Housing Finance',
    'Tata Capital',
    'Fullerton India',
    'Muthoot Finance',
    'Mahindra Finance'
  ]

  // Using Reactive From Module We Provide the name of the group

  LoanForm: FormGroup;
  loginuserdata:UserLogin|null = null
  userid:number|undefined=undefined
  constructor(private Loanservice: LoanService, private fb: FormBuilder,private ExpenseService:ExpenseServiceService) {
    this.LoanForm = this.fb.group({
      UserId:this.userid,
      LoanType: ['', Validators.required],
      Lender: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      interestRate: [null, [Validators.required, Validators.min(7)]],
      termMonths: [null, [Validators.required, Validators.min(6)]],
      emi: [null],
      startDate: ['', Validators.required],
      dueDate: [''],
      TotalAmounttopay: [null],
      repayment:[null],
      status:'active',
      remainingAmount: [null],
      paidEmis:[null]
    })
  }

  // Calculated Monthly Emi
  get MonthlyEmi(): number {
    const principle = this.LoanForm.get('amount')?.value || 0;
    const anualinterest = this.LoanForm.get('interestRate')?.value || 0;
    const no_of_month = this.LoanForm.get('termMonths')?.value || 0;
    // Convert into munber
    const p = Number(principle);
    const r = Number(anualinterest) / 12 / 100;
    const n = Number(no_of_month)
    // Condition if I have value 0 in all principle and annual intrest and no of month
    if (p === 0 || r === 0 || n === 0)
      return 0

    // Calculating Monthly EMI
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

    return Number(emi.toFixed(2))
  }

  // get Remaining Amount
  // get RemainingAmount(): number {
  //   const 
  // }

  // Due Month 
  get DUEDATE(): Date | null {
    const startdate = this.LoanForm.get('startDate')?.value;
    const months = this.LoanForm.get('termMonths')?.value;
    if (!startdate || !months) return null;

    const start = new Date(startdate);
    start.setMonth(start.getMonth() + Number(months));
    return start;
  }
  get DUEDATEString(): string {
    const due = this.DUEDATE;
    return due ? due.toISOString().substring(0, 10) : '';
  }

  // Total Remaining amount of Loan

  get TotalremainingamountLoan(): Number {
    const n = this.LoanForm.get('termMonths')?.value // n standa for no of month
    const emi = this.MonthlyEmi
    return Number((n * emi).toFixed(2));
  }

  // Total Amount Payment
  get TotalAmount(): Number {
    const n = this.LoanForm.get('termMonths')?.value // n standa for no of month
    const emi = this.MonthlyEmi
    return Number((n * emi).toFixed(2));
  }
  // ngoninit 
  ngOnInit(): void {
    this.fetchUserdetails()
  }

  //Fetching User details Again in this Component
    fetchUserdetails():void{
      
      const Userlogined = localStorage.getItem('user');
      const Userdata = Userlogined ? JSON.parse(Userlogined) : null
      console.log(Userdata);

      if(Userdata && Userdata.id){
        this.userid = Userdata.id
        
        console.log(this.userid,'Userid');
        
      }

      
  }
  // Submit button work

  onSubmit() {
   
    if (this.LoanForm.valid) {
      this.LoanForm.patchValue({
        UserId: this.userid,
        emi: this.MonthlyEmi,
        dueDate: this.DUEDATEString,
        TotalAmounttopay: this.TotalAmount,
        status:'active',
        remainingAmount: this.TotalremainingamountLoan
      })

     console.log(this.LoanForm.value);
     
      
      this.Loanservice.AddLoan(this.LoanForm.value).subscribe((data) => {
          
        

        const ExpenseTransaction:Expense = {
          UserId:this.userid,
          Amount:this.LoanForm.get('amount')?.value||0,
          Type:"Credit",
          Category:this.LoanForm.get('LoanType')?.value || '',
          Date:new Date().toISOString().slice(0, 10),
          Time:new Date().toLocaleTimeString(),
          Description:this.LoanForm.get('Lender')?.value || ''
        }
        this.ExpenseService.addexpense(ExpenseTransaction).subscribe(()=>{})
        
        this.LoanForm.reset({
          LoanType: '',
          Lender: '',
          amount: null,
          interestRate: null,
          termMonths: null,
          emi: null,
          startDate: '',
          dueDate: '',
          TotalAmounttopay: null
        })
       
        alert('Successfull Added')

      })
    }
  }
}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ExpenseServiceService } from '../../Service/expense-service.service';
import { Expense } from '../Model/Expense.model';
import { CommonModule } from '@angular/common';
import { UserLoginService } from '../../Service/user-login.service';
import { UserLogin } from '../Model/user.modal';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-expense',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit,AfterViewInit {
  transaction: Expense = {
    UserId: undefined,
    Amount: 0,
    Date: '',
    Time: '',
    Type: '',
    Category: '',
    Description: ''
  };
  UserData:{}={}
  User:UserLogin|null=null
  Userid:number|undefined=undefined

  transactiondata: Expense[] = []
  totaBalance: number = 0
  constructor(private expenseservice: ExpenseServiceService,private UserId:UserLoginService, private router:Router , private route:ActivatedRoute) {

    this.fetchbalance()   

  
  }
  ngAfterViewInit(): void {
   
  }
  ngOnInit(): void {
   
    this.fetchUserData()
    this.getUserid()
  }
  getUserid():void{
    let user = history.state.loggedinUser;

    if(!user){
      const storedUser = localStorage.getItem('user')
      console.log(storedUser,'if user does not get from router');

      user = storedUser ? JSON.parse(storedUser) :null
      
    }
    if(user && user.id){
      this.Userid = user.id
      this.transaction.UserId = this.Userid
      console.log('userid',this.Userid);
      
    }
  
    
    
  }
  

  fetchbalance() {
    this.expenseservice.GetExpense().subscribe((data) => {
      this.transactiondata = data

      this.totaBalance = this.transactiondata.filter((data) => data.Type === 'Credit').reduce((sum, blance) => sum + Number(blance.Amount), 0)   
    })   
  }

  fetchUserData(){
    this.UserId.getUser().subscribe((data)=>
   
    {})
  }
  onSubmit(form: NgForm) {
   
    if (!form.valid)return 
    
    const formDetails: Expense = this.transaction

    if( formDetails.Type === 'Debit'  && formDetails.Amount > this.totaBalance){
      alert('Insufficient Balance')
      return
    }
    
    
      
      this.expenseservice.addexpense(formDetails).subscribe({
        next: (res) => {
          alert('Expense added successfully!');
          
          
          form.resetForm({
            Amount: 0,
            Date: '',
            Time: '',
            Type: '',
            Category: '',
            Description: ''
          }); // clear the form
          this.fetchbalance()
        },
        error: (err) => {
          console.error('Error adding expense:', err);
          alert('Failed to add expense');
        }
      });
    
  }
}

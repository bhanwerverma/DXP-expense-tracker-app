import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { ExpenseServiceService } from '../../Service/expense-service.service';
import { Expense } from '../Model/Expense.model';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { LoanService } from '../../Service/loan.service';
import { Loaninterface } from '../Model/Loan.modal';
import { UserLoginService } from '../../Service/user-login.service';
import { Router } from '@angular/router';
import { UserLogin } from '../Model/user.modal';
Chart.register(...registerables)
@Component({
  selector: 'app-dashboard',
  imports: [NgFor, NgIf, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  ExpenseDetail: Expense[] = []
  Balance: number = 0
  Income: number = 0
  Expense: number = 0
  LoanAmount: number = 0
  LoanData: Loaninterface[] = []
  Categories: string[] = []
  Expensediture: Number[] = []
  Userid: number = 0
  UserLogin: UserLogin | null = null
  public doughnutChartType: ChartType = 'pie';
  public ExpenseDoughnutCamvas: ChartType = 'doughnut'
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef;
  @ViewChild('ExpenseDoughnutCanvas') ExpenseDoughnutCanvas!: ElementRef
  constructor(private Expenseservice: ExpenseServiceService, private LoanService: LoanService, private User: UserLoginService, private router:Router) { }
  ngOnInit(): void {
    
    let user = history.state.loggedinUser;
    
    
    if(!user){
      const storedUser = localStorage.getItem('user');   
      user = storedUser ? JSON.parse(storedUser) : null
    }
    if(user && user.id){
      this.UserLogin = user
      this.Userid = user.id
      console.log('User ID :',this.Userid);
      
      // console.log("user login data :",this.UserLogin);
      // console.log('UserID :', user[0]?.id);
           
    }
    else{
      console.warn("User Id Not Found in router state");
      
    }
    
    this.LoanService.GetLoan().subscribe((data) => {
      this.LoanData = data.filter((data)=> data.UserId === this.Userid)
      this.LoanAmount = this.LoanData.reduce((sum, loan) => sum + Number(loan.amount), 0)
    })

    
  }



  ngAfterViewInit(): void {

    // data getting form json to show in doughnut chart
    this.Expenseservice.GetExpense().subscribe(data => {
      this.ExpenseDetail = data.filter((items)=>items.UserId === this.Userid);

      this.getBalance(); // Calculate Income/Expense/Balance




      // Now create the chart with the loaded data
      const chartData = [this.Income, this.Expense];
      const labels = ['Income', 'Expense'];

      new Chart(this.doughnutCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: chartData,
            backgroundColor: ['#4394E5', '#F0561D'],

          }]
        }
      });

      this.Expensediture = this.ExpenseDetail.filter((data) =>
        data.Type === "Debit" && data.UserId === this.Userid).map((Data) => Data.Amount);


      this.Categories = this.ExpenseDetail.filter((data) => data.Type === "Debit" && data.UserId === this.Userid ).map((data) => data.Category)
      


      new Chart(this.ExpenseDoughnutCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          // labels: this.Categories, 
          datasets: [{
            data: this.Expensediture,
            backgroundColor: ['#4394E5', '#0066CC', '#004D99', '#003366', '#204D00', '#F0561D', '#B1380B']
          }]
        }
      })
    });







  }
  //getting Balance in the account
  getBalance(): void {

    //getting Income
    this.Income = this.ExpenseDetail.filter((data) =>
      data.Type === "Credit" && data.UserId === this.Userid
    ).reduce((sum, i) => sum + Number(i.Amount), 0)

    //Getting Expense
    this.Expense = this.ExpenseDetail.filter((data) =>
      data.Type === "Debit" && data.UserId === this.Userid
    ).reduce((sum, e) => sum + Number(e.Amount), 0);




    this.Balance = Number(this.Income) - Number(this.Expense)

  }
  //This is for Chart chowing
  public doughnutChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#4394E5', '#0066CC', '#004D99', '#003366', '#204D00', '#F0561D', '#B1380B']
    }]
  };
  public doughnutChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };


}


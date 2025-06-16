import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '../Component/Model/Expense.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseServiceService {
  private ApiUrl = "http://localhost:3000/Transactions"
  constructor(private http:HttpClient) { }
 
  addexpense(Data:Expense):Observable<Expense>{
    return this.http.post<Expense>(this.ApiUrl,Data)
  }
  delete(id:number):Observable<void>{
    return this.http.delete<void>(`${this.ApiUrl}/${id}`)
  }
  GetExpense():Observable<Expense[]>{
    return this.http.get<Expense[]>(this.ApiUrl)
  }
}

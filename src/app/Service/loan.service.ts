import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loaninterface } from '../Component/Model/Loan.modal';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private aipUrl = "http://localhost:3000/Loan"
  constructor(private http : HttpClient) { }

  // first service to add Loan details in JSON server

  AddLoan(Loan:Loaninterface):Observable<Loaninterface[]>{
    return this.http.post<Loaninterface[]>(this.aipUrl,Loan)
  }

  // Second Service to get the Loan Detaild from JSON server

  GetLoan():Observable<Loaninterface[]>{
    return this.http.get<Loaninterface[]>(this.aipUrl)
  }

  UpdateLoan(id: number, loan: Partial<Loaninterface>): Observable<Loaninterface> {
  return this.http.put<Loaninterface>(`${this.aipUrl}/${id}`, loan);
}

  
}

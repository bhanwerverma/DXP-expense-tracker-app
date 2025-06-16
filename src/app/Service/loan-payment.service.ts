import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Loanrepayment } from '../Component/Model/LoanPayment.modal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanPaymentService {
  private apiurl = "http://localhost:3000/LoanPayment"
  constructor(private http:HttpClient) { }

addLoanPayment(repayment: Loanrepayment) {
  return this.http.post<Loanrepayment>(this.apiurl, repayment);
}


  getLoanPayment():Observable<Loanrepayment[]>{
    return this.http.get<Loanrepayment[]>(this.apiurl)
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogin } from '../Component/Model/user.modal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  private api = 'http://localhost:3000/UserDetails'
  constructor(private http:HttpClient) { }

  addUser(User:UserLogin):Observable<UserLogin>{
    return this.http.post<UserLogin>(this.api,User)
  }

  getUser():Observable<UserLogin[]>{
    return this.http.get<UserLogin[]>(this.api)
  }

  getUserId(id:number):Observable<UserLogin[]>{
    return this.http.get<UserLogin[]>(`${this.api}/${id}`)
  }

  checkUser(Email:string):Observable<UserLogin[]>{
    return this.http.get<UserLogin[]>(`${this.api}?Email=${Email}`)
 
  }
  checkloginUser(Email:string,Password:string):Observable<UserLogin[]>{
    return this.http.get<UserLogin[]>(`${this.api}?Email=${Email}&Password=${Password}`)
  }
}

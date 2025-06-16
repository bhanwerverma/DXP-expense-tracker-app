import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { UserLogin } from '../Component/Model/user.modal';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
 private userSubject = new BehaviorSubject<UserLogin | null>(this.getUserFromStorage());

  currentUser$ = this.userSubject.asObservable();

  private getUserFromStorage(): UserLogin | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setUser(user: UserLogin | null): void {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    this.userSubject.next(user);
  }
}

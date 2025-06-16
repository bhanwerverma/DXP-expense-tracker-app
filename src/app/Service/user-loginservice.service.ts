import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserLoginserviceService {
  private userKey= "LoginedUser";
  constructor() { }
   setLoggedInUser(user: any) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getLoggedInUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getLoggedInUserId(): string | null {
    return this.getLoggedInUser()?.id || null;
  }

  logout() {
    localStorage.removeItem(this.userKey);
  }
}


import { Component, Input, OnInit, output } from '@angular/core';

import { Router, RouterLink, RouterOutlet, } from '@angular/router';
import { UserLogin } from '../Component/Model/user.modal';
import { NgIf, TitleCasePipe } from '@angular/common';
import { AuthServiceService } from '../Service/auth-service.service';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink,NgIf,TitleCasePipe,RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  User: UserLogin|null = null
  showUserdashboard:boolean = false

  constructor(private router:Router, private authservice:AuthServiceService){}
  isAdmin = false;
  ngOnInit(): void {
   this.authservice.currentUser$.subscribe(user => {
      this.User = user;
      this.showUserdashboard = !!user;

      if(this.User?.role === "Admin"){
        this.isAdmin = true
      }
      else if(this.User?.role === "User"){
        this.isAdmin = false
      }
      
    });
   
  }



  Signin(){
    this.router.navigate(['/Login'])
  }

  SignOut(){
    debugger
    this.isAdmin = false
    this.authservice.setUser(null)
    this.router.navigate(['/Login'])
  
  }
}

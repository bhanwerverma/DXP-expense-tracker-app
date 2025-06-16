import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserLoginService } from '../Service/user-login.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthServiceService } from '../Service/auth-service.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  
  UserLogin: FormGroup
  constructor(private fb:FormBuilder,private LoginService:UserLoginService,private router:Router,private Authservice:AuthServiceService){
    this.UserLogin = this.fb.group({
      Email:['',[Validators.required]],
      Password:['',[Validators.required]],
    })
  }
  
 
  onLogin(){
    if(this.UserLogin.valid){
    
      const User = this.UserLogin.value;
      this.LoginService.checkloginUser(User.Email,User.Password).subscribe(loggedinUser=>{
          debugger
        const user = loggedinUser
        console.log(user[0]);
        
        if(user.length > 0 && user[0]){
          debugger
          const loginuser = user[0];
          // localStorage.setItem('user',JSON.stringify(loginuser))
          this.Authservice.setUser(loginuser)
          if(loginuser.role === "Admin"){
            this.router.navigate(['/AdminDashboard'])
          }
          else {
            this.router.navigate(['/Dashboard'])
          }

          
          // this.UserLogin.reset()
        }
        else{ 
          alert('Wrong Email and Password')
          this.UserLogin.reset()
        }
      })
    }
   else{
     alert("Pls Enter Valid Input")
   }
  }
  SignUp(){
    this.router.navigate(['/Signup'],)
  }
}

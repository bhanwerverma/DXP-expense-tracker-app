import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserLoginService } from '../Service/user-login.service';
import { UserLogin } from '../Component/Model/user.modal';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  UserForm: FormGroup

  UserData:UserLogin[]=[]
  constructor(private fb: FormBuilder,private Userformservice:UserLoginService,private router:Router) {
    this.UserForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Gender: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(8)]]
    })

   this.refreshData()

  }
  refreshData(){
     this.Userformservice.getUser().subscribe((data)=>{
      this.UserData = data
    })
  }
  onSubmit(){
    
    if(this.UserForm.valid){
     const User = this.UserForm.value;
     this.Userformservice.checkUser(User.Email).subscribe(existingUser => {
      if(existingUser.length>0){
        alert('User is already registered')
        this.UserForm.reset()
      }
      else{

        this.Userformservice.addUser(this.UserForm.value).subscribe()
        
        alert('Successfully registered')
        this.UserForm.reset()
        this.refreshData()
        this.router.navigate(['/Login'])
      }
     })
     
      
    }
    else{
      alert('Pls provide Valid Inputs')
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertyfyService } from 'src/app/services/alertyfy.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  constructor(private authService : AuthService,
              private alertyfy: AlertyfyService,
              private router : Router) { }

  ngOnInit() {
  }

  onLogin(loginForm:NgForm)
  {
      console.log(loginForm.value);

      const token = this.authService.authUser(loginForm.value);

      if (token)
      {
        console.log(token)
        localStorage.setItem('token', token.userName);
        this.alertyfy.success("Login Successful")
        this.router.navigate(['/']);
      }
      else
      {
        this.alertyfy.error('Userid or password not exists')
      }
  }

}

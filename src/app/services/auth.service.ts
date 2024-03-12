import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserForLogin, UserForRegister } from '../model/user';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl;

constructor(private http: HttpClient) { }

authUser(user:UserForLogin){
  
   return this.http.post(this.baseUrl + '/account/login', user);
  // let userArray = [];
  // console.log(user)
  // const storedUsers = localStorage.getItem('Users')

  // if (storedUsers)
  // {
  //   userArray = JSON.parse(storedUsers);   
  // }

  // return userArray.find((p: { userName: any; password: any; }) => p.userName === user.userName && p.password === user.password);
}
registerUser(user: UserForRegister){
    return this.http.post(this.baseUrl + '/account/register', user);
}

}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor() { }

authUser(user:any){

  let userArray = [];
  console.log(user)
  const storedUsers = localStorage.getItem('Users')

  if (storedUsers)
  {
    userArray = JSON.parse(storedUsers);   
  }

  return userArray.find((p: { userName: any; password: any; }) => p.userName === user.userName && p.password === user.password);
}

}

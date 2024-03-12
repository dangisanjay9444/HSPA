import { Injectable } from '@angular/core';
import { UserForRegister } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor() { }

addUsers(user: UserForRegister){
  let users = [];
  const storedUsers = localStorage.getItem('Users')
  if (storedUsers)
  {
    users = JSON.parse(storedUsers);
    users = [user, ...users];
  }
  else
  {
    users = [user];
  }

  localStorage.setItem('Users', JSON.stringify(users));
}

}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UserForRegister } from 'src/app/model/user';
import { AlertyfyService } from 'src/app/services/alertyfy.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  registrationForm!: FormGroup;

  userSubmitted ?: boolean;
  //will store form information in the below user variable
  user ?: UserForRegister;

  constructor(private fb:FormBuilder, 
              private authService: AuthService,
              private alertyfyService:AlertyfyService) { }

  ngOnInit() {
    this.registrationForm = new FormGroup(
       {
         userName: new FormControl(null,Validators.required),
         email : new FormControl(null,[Validators.required, Validators.email]),
         password: new FormControl(null, [Validators.required,Validators.minLength(8)]),
         confirmPassword: new FormControl(null, [Validators.required]),
         mobile: new FormControl(null, [Validators.required, Validators.minLength(7), Validators.maxLength(10)])
       },this.passwordMatchingValidator());

    //this.createRegistrationForm();
  }

  //using a FormBuilder

  createRegistrationForm(){
    this.registrationForm = this.fb.group({
        userName: ['Sanjay',Validators.required],
        email : [null,[Validators.required, Validators.email]],
        password: [null, [Validators.required,Validators.minLength(8)]],
        confirmPassword: [null, [Validators.required]],
        mobile: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(10)]]
    },{Validators: this.passwordMatchingValidator});
  }

  // passwordMatchingValidator(fg: FormGroup): { [key: string]: boolean } | null {
  //   return fg.get('password')?.value === fg.get('confirmPassword')?.value ? null :
  //     { notmatched: true };
  // }

  passwordMatchingValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');
      
      return password && confirmPassword && password.value === confirmPassword.value
        ? null
        : { notmatched: true };
    };
  }

  //----------------------------
  // Getter methods for all formcontrols
  //

  userData(): UserForRegister{
    return this.user = {
      userName: this.userName.value,
      email: this.email.value,
      password: this.password.value,
      mobile: this.mobile.value
    }
  }

  get userName(){
    return this.registrationForm.get('userName') as FormControl;
  }
  get email(){
    return this.registrationForm.get('email') as FormControl;
  }
  get password(){
    return this.registrationForm.get('password') as FormControl;
  }
  get confirmPassword(){
    return this.registrationForm.get('confirmPassword') as FormControl;
  }
  get mobile(){
    return this.registrationForm.get('mobile') as FormControl;
  }

  onSubmit(){
    console.log(this.registrationForm.value);
    this.userSubmitted = true

    if(this.registrationForm.valid)
    {
    //this.user = Object.assign(this.user,this.registrationForm.value)
    //localStorage.setItem('Users', JSON.stringify(this.user))
    //this.userService.addUsers(this.user);
    // this.userService.addUsers(this.userData());
        this.authService.registerUser(this.userData()).subscribe( () => {
        this.registrationForm.reset();
        this.userSubmitted = false
        this.alertyfyService.success("Congrats, you have successfully registered")
      }
      //commented because now we are using the http interceptor to handle the errors globally
      // , error => {
      // console.log(error);
      // this.alertyfyService.error(error.error);
      // }
      );    
    }
    else
    {
      this.alertyfyService.error("kindly provide the required fields")
    }
  }

  // addUsers(user: any){
  //       let users = [];
  //       const storedUsers = localStorage.getItem('Users')
  //       if (storedUsers)
  //       {
  //         users = JSON.parse(storedUsers);
  //         users = [user, ...users];
  //       }
  //       else
  //       {
  //         users = [user];
  //       }

  //       localStorage.setItem('Users', JSON.stringify(users));
  // }

}

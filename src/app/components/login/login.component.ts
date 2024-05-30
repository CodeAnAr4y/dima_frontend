import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  user: any;
  signUp: boolean = false;
  role = "покупатель";

  registrationForm = new FormGroup({
    username: new FormControl('', Validators.required),
    company: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    fullname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
  });

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(public loginService: LoginService, public router: Router, private cookie: CookieService) {}

  ngOnInit(): void {
    // this.loginService.getUser().subscribe((data) => (this.user = data));
  }
  changeRole(){
    if (this.role === 'покупатель') {
      this.role = 'продавец';
    } else {
      this.role = 'покупатель';
    }
  }

  registrate() {
    const formData = this.registrationForm.value;
    const user = {
      username: formData.username ? formData.username : '',
      company: formData.company ? formData.company : '',
      address: formData.address ? formData.address : '',
      phone: formData.phone ? formData.phone : '',
      password: formData.password ? formData.password : '',
      fullname: formData.fullname ?formData.fullname : "" ,
      email: formData.email ? formData.email : '',
      created: Date.now(),
      role: this.role === 'покупатель' ? 1 : 2,
    };
    this.loginService.registerUser(user).subscribe(
      (result: User) => {
        console.log(result);
        this.cookie.set('user', result.id.toString())
        this.router.navigate([""])
      },
      (error) => {

      }
    );
  }

  login() {
    console.log(this.loginForm.value);
    const login = this.loginForm.value.username ? this.loginForm.value.username : "";
    const pass = this.loginForm.value.password ? this.loginForm.value.password : ""
    this.loginService.findUserByUsernamePassword(login, pass).subscribe((res: User) => {
      this.cookie.set('user', res.id.toString())
      this.router.navigate([""])
    }, (error)=> {
      alert("Пользователь на найден")
    })
  }
}

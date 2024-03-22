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

  registrationForm = new FormGroup({
    username: new FormControl('', Validators.required),
    company: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(public loginService: LoginService) {}

  ngOnInit(): void {
    // this.loginService.getUser().subscribe((data) => (this.user = data));
  }

  registrate() {
    const formData = this.registrationForm.value;
    const user: User = {
      username: formData.username ? formData.username : '',
      company: formData.company ? formData.company : '',
      address: formData.address ? formData.address : '',
      phone: formData.phone ? formData.phone : '',
      password: formData.password ? formData.password : '',
    };
    this.loginService.registerUser(user).subscribe((res) => {
      console.log(res);
    });
  }

  login() {
    console.log(this.loginForm.value);
  }
}

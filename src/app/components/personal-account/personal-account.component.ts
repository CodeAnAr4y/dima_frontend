import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personal-account.component.html',
  styleUrl: './personal-account.component.scss',
})
export class PersonalAccountComponent implements OnInit {
  rootUser: User;
  user: User;
  constructor(
    private userService: UserService,
    private cookie: CookieService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.cookie.get('user'));
    if (id) {
      this.userService.getCurrentUser(id).subscribe((res) => {
        this.user = res;
        this.rootUser = res;
      });
    }
  }

  editAccount(fieldKey: any, field: any) {
    if (fieldKey === 'password') {
      const res = prompt('введите нынешний пароль');
      if (res === this.user.password) {
        const newPass = prompt('Введите новый пароль');
        this.user.password = newPass;
      }
    } else {
      const newValue = prompt('Введите новое значение', this.user[fieldKey]);
      if (newValue) {
        this.user[fieldKey] = newValue;
        this.userService
          .changeAccount(this.user.id, this.user)
          .subscribe((res) => {
            alert('Изменено на ' + this.user[fieldKey]);
          }, (error)=>{
            alert("Произошла ошибка при изменении данных пользователя " + error);
          });
      } else {
        alert('Поле не должно быть пустым');
      }
    }
  }
}

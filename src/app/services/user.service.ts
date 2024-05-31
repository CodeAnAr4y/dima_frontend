import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(public http: HttpClient) {}

  getCurrentUser(id: number): Observable<User> {
    return this.http.get<User>(`http://localhost:8000/api/users/${id}`);
  }

  changeAccount(id: number, user: User): Observable<User> {
    return this.http.put<User>(`http://localhost:8000/api/users/${id}/update`, user);
  }
}

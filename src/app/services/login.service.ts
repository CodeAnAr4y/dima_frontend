import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  backendUrl = environment.backendUrl;
  backendApiUrl = this.backendUrl + '/api';
  loginUrl = this.backendApiUrl + '/get';
  registrationUrl = this.backendApiUrl + '/users/register';

  constructor(private http: HttpClient) {}

  registerUser(params: Object): Observable<User> {
    return this.http.post<User>(this.registrationUrl, params);
  }

  findUserByUsernamePassword(username: string, password: string): Observable<User> {
    return this.http.post<User>(`http://localhost:8000/api/login`, {username: username, password: password})
  }
}

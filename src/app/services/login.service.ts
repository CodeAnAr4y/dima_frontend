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
  registrationUrl = this.backendApiUrl + '/registrate';

  constructor(private http: HttpClient) {}

  registerUser(params: User): Observable<User> {
    return this.http.post<User>(this.registrationUrl, params);
  }
}

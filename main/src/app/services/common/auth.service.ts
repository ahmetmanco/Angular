import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticatedSubject.asObservable(); // bu stream'dir

  constructor(private jwtHelper: JwtHelperService) { }

  identityCheck() {
  const token: string | null = localStorage.getItem("accessToken");
  console.log("token", token);
  const expired: boolean = this.jwtHelper.isTokenExpired(token);
  console.log("expired", expired);
  const result = token != null && !expired;
  console.log("authenticated:", result);
  this._isAuthenticatedSubject.next(result);
}
}
export let _isAuthenticated: boolean;

import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticatedSubject.asObservable();

  constructor(private jwtHelper: JwtHelperService) { }

  // Token'i kaydet ve state'i güncelle
  setToken(token: string): void {
    localStorage.setItem("accessToken", token); // Key'i tutarlı hale getir
    this._isAuthenticatedSubject.next(true);
  }
  getToken(): string | null {
  return localStorage.getItem("accessToken");
  }

  isTokenExpired(): boolean {
  const token = this.getToken();
  return token ? this.jwtHelper.isTokenExpired(token) : true;
  }
  // Token'i sil ve state'i güncelle
  removeToken(): void {
    localStorage.removeItem("accessToken");
    this._isAuthenticatedSubject.next(false);
  }
logout() {
  this.removeToken();
  // Gerekirse başka temizlikler
}
  identityCheck(): void {
    const token: string | null = localStorage.getItem("accessToken"); // Key tutarlılığı
    const expired: boolean = this.jwtHelper.isTokenExpired(token);
    const result = token != null && !expired;
    this._isAuthenticatedSubject.next(result);
  }
}
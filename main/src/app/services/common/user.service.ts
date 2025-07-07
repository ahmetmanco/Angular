import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { User } from 'src/app/Entities/user';
import { Create_User } from 'src/app/contract/create_user';
import { firstValueFrom, observable, Observable } from 'rxjs';
import { tokenResponse } from 'src/app/Token/tokenResponse';
import { AuthService } from './auth.service';
import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClientService: HttpClientService, 
    private authService: AuthService
  ) { }

  async create(user: User): Promise<Create_User> {
    const observable = this.httpClientService.post<Create_User>({
      controller: "Users"
    }, user as any);
    return await firstValueFrom(observable);
  }

  async login(uname: string, password: string, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<any | tokenResponse> = this.httpClientService.post<any | tokenResponse>({
      controller: "Users",
      action: "login"
    }, { uname, password });

    try {
      const tokenResponse: tokenResponse = await firstValueFrom(observable) as tokenResponse;
      if (tokenResponse?.token?.accessToken) {
        this.authService.setToken(tokenResponse.token.accessToken);
        if (callBackFunction) callBackFunction();
        return tokenResponse;
      }
      throw new Error("AccessToken bulunamadı");
    } catch (error) {
      console.error("Login hatası:", error);
      throw error;
    }
  }
   googleLogin(idToken: string): Observable<tokenResponse> {
    const payload = {
      provider: 'GOOGLE',
      IdToken: idToken
    };
    return this.httpClientService.post<tokenResponse>({
      controller: "Users",
      action: "GoogleLogin"
     }, payload);
    }
}
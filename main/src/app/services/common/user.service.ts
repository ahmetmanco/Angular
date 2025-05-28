import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { User } from 'src/app/Entities/user';
import { Create_User } from 'src/app/contract/create_user';
import { firstValueFrom, Observable } from 'rxjs';
import { Token } from 'src/app/Token/token';
import { tokenResponse } from 'src/app/Token/tokenResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService : HttpClientService) { }

  async create(user: User) : Promise<Create_User> {
   const observable = this.httpClientService.post<Create_User>({
  controller: "Users"
}, user as any);
    return await firstValueFrom(observable);
  }

  async login(uname:string, password:string) : Promise<any> {
    const observable : Observable<any | tokenResponse> = this.httpClientService.post<any | tokenResponse>({
      controller: "Users",
      action: "login"
    }, {uname,password})

    const tokenResponse: tokenResponse = await firstValueFrom(observable) as tokenResponse;
    if(tokenResponse){
     localStorage.setItem("AccessToken",tokenResponse.token.AccessToken);
    // localStorage.setItem("Expiration",token.Expiration.toString());
     alert("Kullanıcı girişi başarılı ");
    }
     

  }
}

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttperrorIntercepterService implements HttpInterceptor{

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error=> {
      switch (error.status) {
       case HttpStatusCode.Unauthorized:
        alert("Yetkisiz işlem : Bu işlemi yapmaya yetniz yok !");
        break;
        case HttpStatusCode.InternalServerError:
        alert("Sunucu hatası : Sunucuya erişilmiyor !");
        break;
        case HttpStatusCode.BadRequest:
        alert("Geçersiz istek !");
        break;
        case HttpStatusCode.NotFound:
        alert("Sayfa Bulunamadı");
        break;
        default:
          alert("Beklenmeyen bir hata !");
          break;
      }
      return of(error);
    }));
  }
}

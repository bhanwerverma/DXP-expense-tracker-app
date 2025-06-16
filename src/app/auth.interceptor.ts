import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token')
    if(token){
      const cloned = req.clone({
        setHeaders:{
          Authorization: ` Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }
    return next.handle(req) 
  }
}
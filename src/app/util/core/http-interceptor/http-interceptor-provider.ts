import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpXsrfInterceptor} from './http-xsrf-interceptor';

export const httpInterceptorProvider = [
  {
    multi: true,
    provide: HTTP_INTERCEPTORS,
    useClass: HttpXsrfInterceptor,
  },
];

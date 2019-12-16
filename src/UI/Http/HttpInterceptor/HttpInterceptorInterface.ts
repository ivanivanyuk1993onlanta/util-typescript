import { HttpHandlerInterface } from "../HttpHandler/HttpHandlerInterface";
import { Observable } from "rxjs";

export interface HttpInterceptorInterface {
  /**
   * Method implementation should return Observable<HttpHandler>, wrapped into
   * some logic
   * @param request
   * @param nextHandler
   */
  interceptHttp$(
    request: Request,
    nextHandler: HttpHandlerInterface
  ): Observable<HttpHandlerInterface>;
}

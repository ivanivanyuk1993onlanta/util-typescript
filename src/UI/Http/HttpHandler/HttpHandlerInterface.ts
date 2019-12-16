import { Observable } from "rxjs";

export interface HttpHandlerInterface {
  /**
   * Method implementation should return Observable<Response>, wrapped into some
   * logic
   * @param request
   */
  handleHttp$(request: Request): Observable<Response>;
}

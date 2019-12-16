import { Observable } from "rxjs";

export interface HttpClientInterface {
  /**
   * Method implementation should return Observable with Response
   * @param input
   * @param init
   */
  fetch$(input: string | Request, init?: RequestInit): Observable<Response>;
}

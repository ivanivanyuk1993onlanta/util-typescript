import { Observable, Subject } from "rxjs";
import { AuthRequiredError } from "./AuthRequiredError";

export interface AuthDataSourceInterface<CredentialsType> {
  /**
   * Implementation of property should contain Subject, which should fire, when
   * AuthRequiredError occurs, like when server return 401
   */
  readonly authRequiredErrorS$: Subject<AuthRequiredError>;

  /**
   * Implementation of property should contain Observable with text which can be
   * interpreted by user as name of Auth object
   */
  readonly displayTextContinuous$: Observable<string>;

  /**
   * Implementation of property should contain Observable with boolean whether
   * auth object is logged in or not
   */
  readonly isLoggedInContinuous$: Observable<boolean>;

  /**
   * Implementation of property should contain Observable with boolean whether
   * data source allows registration or not
   */
  readonly hasRegistration: boolean;

  /**
   * Method implementation should log in and return void after success
   */
  logIn$(credentials: CredentialsType): Observable<void>;

  /**
   * Method implementation should log out and return void after success
   */
  logOut$(): Observable<void>;
}

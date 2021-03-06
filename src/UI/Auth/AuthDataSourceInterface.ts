import { Observable, Subject } from "rxjs";
import { AuthRequiredError } from "./AuthRequiredError";
import { AuthInterface } from "./AuthInterface";
import { SchemalessDataObjectType } from "../../MessageTransfer/SchemalessDataObjectType";

export interface AuthDataSourceInterface {
  /**
   * Implementation of property should contain Observable with auth object,
   * notice that auth object should always exist
   */
  readonly authContinuous$: Observable<AuthInterface | undefined>;

  /**
   * Implementation of property should contain Subject, which should fire, when
   * AuthRequiredError occurs, like when server returns 401
   */
  readonly authRequiredErrorS$: Subject<AuthRequiredError>;

  /**
   * Implementation of property should contain boolean whether data source
   * allows registration or not
   */
  readonly hasRegistration: boolean;

  /**
   * Method implementation should log in and return void after success
   */
  logIn$(credentials: SchemalessDataObjectType): Observable<void>;

  /**
   * Method implementation should log out and return void after success
   */
  logOut$(): Observable<void>;
}

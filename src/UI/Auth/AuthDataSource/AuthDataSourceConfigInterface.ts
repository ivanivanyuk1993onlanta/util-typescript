import { PersistentStorageInterface } from "../../PersistentStorage/PersistentStorageInterface";
import { HttpClientInterface } from "../../Http/HttpClient/HttpClientInterface";

export interface AuthDataSourceConfigInterface {
  authIdHeaderName: string;
  hasRegistration: boolean;
  httpClient: HttpClientInterface;
  logInUrl: string;
  logOutUrl: string;
  persistentStorage: PersistentStorageInterface;
  tokenHeaderName: string;
}

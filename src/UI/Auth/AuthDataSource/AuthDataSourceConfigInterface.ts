import { PersistentStorageInterface } from "../../PersistentStorage/PersistentStorageInterface";
import { HttpClientInterface } from "../../HttpClient/HttpClientInterface";

export interface AuthDataSourceConfigInterface {
  hasRegistration: boolean;
  httpClient: HttpClientInterface;
  persistentStorage: PersistentStorageInterface;
  logInUrl: string;
  logOutUrl: string;
}

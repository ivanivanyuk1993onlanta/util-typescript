import { Observable } from "rxjs";

export interface GetDataListContinuous$Interface<DataObjectType> {
  /**
   * Method implementation should return Observable with list of data objects
   */
  getDataListContinuous$(): Observable<DataObjectType[]>;
}

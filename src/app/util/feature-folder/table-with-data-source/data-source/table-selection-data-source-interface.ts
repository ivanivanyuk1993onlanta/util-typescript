import {Observable} from 'rxjs';

// todo divide to check box + master check box as in https://material.angular.io/components/table/overview#selection and file system like
//  selection(Click, Ctrl+Click, Shift+Click, Ctrl+Shift+Click)
export interface TableSelectionDataSourceInterface<DataObjectType> {
  // Should append range to selection without clearing current
  appendRangeToSelection$(dataObject1, dataObject2: DataObjectType): Observable<void>;

  clearSelection$(): Observable<void>;

  getSelectionContinuous$(): Observable<Array<DataObjectType>>;

  hasSelectionContinuous$(): Observable<boolean>;

  isAllSelectedContinuous$(): Observable<boolean>;

  isSelectedContinuous$(dataObject: DataObjectType): Observable<boolean>;

  selectAll$(): Observable<void>;

  select$(dataObject: DataObjectType): Observable<void>;

  // Should select only specified range, clearing everything else
  selectRange$(dataObject1, dataObject2: DataObjectType): Observable<void>;

  toggle$(dataObject: DataObjectType): Observable<void>;
}

import {Observable} from 'rxjs';

export interface DynamicComponentInterface<InputType> {
  input$: Observable<InputType>;
}

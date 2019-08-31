import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';

// Как это должно работать - мы формируем подписку на изменения существующего источника данных, в подписке обновляем
// значения свойств formControl, который будет использоваться контролом
// Обрати внимание, что при вызове setValue$ не нужно ничего делать с formControl, он должен только брать данные из
// первоисточника, менять данные в первоисточнике должен setValue$, что корректно, без цикла, изменит значени в контроле
// Обрати внимание, что в конструктор, скорее всего, нужно будет передавать changeBroadcaster для takeUntil, потому что
// подписка формируется не внутри компонента, у которого есть ngOnDestroy. Почему мы не заведём этот метод у класса -
// потому что он может быть не нужен + это логика не контрола, а источника данных, контролу незачем о нём знать
// (возможно, моё мнение изменится)
export interface SelectDataSourceInterface<ValueType> {
  formControl: FormControl;

  getDisplayTextContinuous$(value: ValueType): Observable<string>;

  getLabelTextContinuous$(): Observable<string>;

  getValueListContinuous$(): Observable<ValueType[]>;

  setValue$(value: ValueType): Observable<ValueType>;
}

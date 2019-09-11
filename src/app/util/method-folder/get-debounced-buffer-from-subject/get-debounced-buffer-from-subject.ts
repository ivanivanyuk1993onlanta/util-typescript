import {Observable, Subject} from 'rxjs';
import {buffer, debounceTime} from 'rxjs/operators';

// Метод нужен для тех случаев, когда нам может много раз подряд прийти запрос на обращение к какому-нибудь урлу. Он
// дождётся прихода следующих значений, после чего сформирует список и отправит запрос, что позволит посылать не единичные
// запросы для каждой потребности, а сформировать общий запрос для пришедших запросов. По умолчанию debounceTime2 = 0, что
// положит событие в конец EventLoop

export function getDebouncedBufferFromSubject$<T>(
  subject: Subject<T>,
  debounceTime2 = 0,
): Observable<T[]> {
  return subject.pipe(
    buffer(subject.pipe(debounceTime(debounceTime2))),
  );
}

import { Observable, Subject } from "rxjs";
import { buffer, debounceTime } from "rxjs/operators";

// Метод нужен для тех случаев, когда нам может много раз подряд прийти запрос на обращение к какому-нибудь урлу. Он
// дождётся прихода следующих значений, после чего сформирует список и отправит запрос, что позволит посылать не единичные
// запросы для каждой потребности, а сформировать общий запрос для пришедших запросов. По умолчанию debounceTime2 = 0, что
// положит событие в конец EventLoop

// This method is for cases when we can get multiple sequential requests to some url
// It waits for all values, then forms list of values that came and send request.
// That allows to send not multiple api calls(limited by 6 sequential(23.09.2019)), but one api call
// By default, debounceTime2 = 0, which means that timer will wait for all events in EventLoop, but wont't
// wait longer

export function getDebouncedBufferFromSubject$<ValueType>(
  subject: Subject<ValueType>,
  debounceTime2 = 0
): Observable<ValueType[]> {
  return subject.pipe(buffer(subject.pipe(debounceTime(debounceTime2))));
}

import { animationFrameScheduler, of } from "rxjs";
import { repeat } from "rxjs/operators";
import { getSharedObservableWithLastValue } from "../../getSharedObservableWithLastValue/getSharedObservableWithLastValue";

export const requestAnimationFrame$ = getSharedObservableWithLastValue(
  of(0, animationFrameScheduler).pipe(repeat())
);

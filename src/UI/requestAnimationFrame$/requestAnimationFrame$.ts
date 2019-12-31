import { animationFrameScheduler } from "rxjs";
import { repeat } from "rxjs/operators";
import { getSharedObservableWithLastValue } from "../../getSharedObservableWithLastValue/getSharedObservableWithLastValue";
import { scheduleArray } from "rxjs/internal/scheduled/scheduleArray";

export const requestAnimationFrame$ = getSharedObservableWithLastValue(
  scheduleArray([undefined], animationFrameScheduler).pipe(repeat())
);

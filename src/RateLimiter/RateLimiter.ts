import { RateLimiterConfigInterface } from "./RateLimiterConfigInterface";
import { LinkedList } from "linked-list-typescript";

export class RateLimiter<CallbackResultType> {
  private _callForPeriodCount = 0;
  private _delayPromiseResolveList = new LinkedList<() => void>();
  private readonly _allowedCallCountPerPeriod: number;
  private readonly _periodInMs: number;

  constructor(config: RateLimiterConfigInterface) {
    this._allowedCallCountPerPeriod = config.allowedCallCountPerPeriod;
    this._periodInMs = config.periodInMs;
  }

  public async callOrDelay(
    callback: () => CallbackResultType
  ): Promise<CallbackResultType> {
    if (this._callForPeriodCount < this._allowedCallCountPerPeriod) {
      ++this._callForPeriodCount;
      this._setTimeoutToResolveDelay();
      return callback();
    } else {
      return new Promise<void>(resolve => {
        this._delayPromiseResolveList.append(resolve);
      }).then(() => callback());
    }
  }

  private _setTimeoutToResolveDelay(): void {
    // Call should be counted only while it's period lasts, then it can be
    // ignored, hence we set timeout, which either calls next delay resolve,
    // without decrementing/incrementing_again _callForPeriodCount to save CPU
    // cycles, or decrements _callForPeriodCount, to allow next callOrDelay
    // calls to return without delay
    setTimeout(() => {
      const nextDelayPromiseResolve = this._delayPromiseResolveList.removeHead();
      if (nextDelayPromiseResolve) {
        nextDelayPromiseResolve();
        this._setTimeoutToResolveDelay();
      } else {
        --this._callForPeriodCount;
      }
    }, this._periodInMs);
  }
}

// Simple tests are to test automatized/randomized tests

import {RateLimiter} from '../rate-limiter';
import {areNumbersClose} from '../../are-numbers-close/are-numbers-close';

const allowedTimeDifference = 2;

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter<number>;
  let startTime: number;

  beforeEach(() => {
    startTime = performance.now();
  });

  it('shouldHandleBursts', (done: DoneFn) => {
    const periodInMs = 100;
    rateLimiter = new RateLimiter({
      allowedCallCountPerPeriod: 3,
      periodInMs,
    });

    Promise.all([...Array(10)].map(() => {
      return rateLimiter.callOrDelay(() => {
        return performance.now();
      });
    })).then(timeList => {
      const timePassedList = timeList.map(time => time - startTime);
      expect(areNumbersClose(timePassedList[0], periodInMs * 0, allowedTimeDifference)).toBeTrue();
      expect(areNumbersClose(timePassedList[1], periodInMs * 0, allowedTimeDifference)).toBeTrue();
      expect(areNumbersClose(timePassedList[2], periodInMs * 0, allowedTimeDifference)).toBeTrue();
      expect(areNumbersClose(timePassedList[3], periodInMs * 1, allowedTimeDifference)).toBeTrue();
      expect(areNumbersClose(timePassedList[4], periodInMs * 1, allowedTimeDifference)).toBeTrue();
      expect(areNumbersClose(timePassedList[5], periodInMs * 1, allowedTimeDifference)).toBeTrue();
      expect(areNumbersClose(timePassedList[6], periodInMs * 2, allowedTimeDifference)).toBeTrue();
      expect(areNumbersClose(timePassedList[7], periodInMs * 2, allowedTimeDifference)).toBeTrue();
      expect(areNumbersClose(timePassedList[8], periodInMs * 2, allowedTimeDifference)).toBeTrue();
      expect(areNumbersClose(timePassedList[9], periodInMs * 3, allowedTimeDifference)).toBeTrue();
      done();
    });
  });
});

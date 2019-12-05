// Randomized tests are to test not predicted by programmer errors

import {RateLimiter} from '../rate-limiter';
import {areNumbersClose} from '../../are-numbers-close/are-numbers-close';
import {getRandomIntFromInterval} from '../../get-random-int-from-interval/get-random-int-from-interval';

const allowedTimeDifference = 10;

describe('RateLimiter', () => {
  let allowedCallCountPerPeriod: number;
  let periodInMs: number;
  let rateLimiter: RateLimiter<number>;
  let startTime: number;
  let taskCount: number;

  beforeEach(() => {
    allowedCallCountPerPeriod = getRandomIntFromInterval(1, 1e2);
    periodInMs = getRandomIntFromInterval(0, 1e2);
    startTime = performance.now();
    taskCount = allowedCallCountPerPeriod * getRandomIntFromInterval(0, 10) + getRandomIntFromInterval(0, allowedCallCountPerPeriod);
  });

  it('shouldHandleRandomData', (done: DoneFn) => {
    rateLimiter = new RateLimiter({
      allowedCallCountPerPeriod,
      periodInMs,
    });

    Promise.all([...Array(taskCount)].map(() => {
      return rateLimiter.callOrDelay(() => {
        return performance.now();
      });
    })).then(timeList => {
      const timePassedList = timeList.map(time => time - startTime);

      timePassedList.forEach((timePassed, index) => {
        expect(areNumbersClose(
          timePassed,
          periodInMs * Math.floor(index / allowedCallCountPerPeriod),
          allowedTimeDifference,
        )).toBeTrue();
      });

      done();
    });
  });
});

// Simple tests are to __tests__ automatized/randomized tests

import { RateLimiter } from "../RateLimiter";

const allowedTimeDifference = 5;

describe("RateLimiter", () => {
  let rateLimiter: RateLimiter<number>;
  let startTime: number;

  beforeEach(() => {
    startTime = performance.now();
  });

  it("shouldHandleBursts", () => {
    const allowedCallCountPerPeriod = 3;
    const periodInMs = 100;
    rateLimiter = new RateLimiter({
      allowedCallCountPerPeriod,
      periodInMs
    });

    return Promise.all(
      [...Array(10)].map(() => {
        return rateLimiter.callOrDelay(() => {
          return performance.now();
        });
      })
    ).then(timeList => {
      const timePassedList = timeList.map(time => time - startTime);

      timePassedList.forEach((timePassed, index) => {
        const expectedTimePassed =
          periodInMs * Math.floor(index / allowedCallCountPerPeriod);
        expect(expectedTimePassed).toBeLessThanOrEqual(timeList[index]);
        expect(timePassedList[index]).toBeLessThan(
          expectedTimePassed + allowedTimeDifference
        );
      });
    });
  });
});

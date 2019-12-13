// Randomized tests are to __tests__ not predicted by programmer errors

import { RateLimiter } from "../RateLimiter";
import { getRandomIntFromInterval } from "../../getRandomIntFromInterval/getRandomIntFromInterval";

const allowedTimeDifference = 10;

describe("RateLimiter", () => {
  let allowedCallCountPerPeriod: number;
  let periodInMs: number;
  let rateLimiter: RateLimiter<number>;
  let startTime: number;
  let taskCount: number;

  beforeEach(() => {
    allowedCallCountPerPeriod = getRandomIntFromInterval(1, 1e2);
    periodInMs = getRandomIntFromInterval(0, 1e2);
    startTime = performance.now();
    taskCount =
      allowedCallCountPerPeriod * getRandomIntFromInterval(0, 10) +
      getRandomIntFromInterval(0, allowedCallCountPerPeriod);
  });

  it("shouldHandleRandomData", () => {
    rateLimiter = new RateLimiter({
      allowedCallCountPerPeriod,
      periodInMs
    });

    return Promise.all(
      [...Array(taskCount)].map(() => {
        return rateLimiter.callOrDelay(() => {
          return performance.now();
        });
      })
    ).then(timeList => {
      const timePassedList = timeList.map(time => time - startTime);

      timePassedList.forEach((timePassed, index) => {
        console.log(`allowedCallCountPerPeriod: ${allowedCallCountPerPeriod}`);
        console.log(`periodInMs: ${periodInMs}`);
        console.log(`index: ${index}`);
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

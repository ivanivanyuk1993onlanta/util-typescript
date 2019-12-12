describe("AsyncReadWriteLock", () => {
  it("shouldPass", () => {
    expect(true).toBeTruthy();
  })
});

// // Randomized tests are to test cases human can't predict
//
// import {FairAsyncReadWriteLock} from '../FairAsyncReadWriteLock';
// import {getRandomIntFromInterval} from '../../../getRandomIntFromInterval/getRandomIntFromInterval';
//
// enum OperationTypeEnum {
//   Read,
//   Write,
// }
//
// describe('AsyncReadWriteLock', () => {
//   let lock: FairAsyncReadWriteLock;
//
//   beforeEach(() => {
//     lock = new FairAsyncReadWriteLock();
//   });
//
//   it('randomizedTest', (done: DoneFn) => {
//     const operationCount = 1000;
//     const operationTimeLimit = 10;
//     const waitTimeoutLimit = 1000;
//     const writeValueLimit = 1000;
//     let value2 = 0;
//
//     const statisticsRecordList = [];
//
//     const promiseList = new Array(operationCount).map((value, index, array) => {
//       const operationTime = getRandomIntFromInterval(0, operationTimeLimit);
//       const operationType = getRandomIntFromInterval(OperationTypeEnum.Read,
//         OperationTypeEnum.Write);
//       const waitTimeout = getRandomIntFromInterval(0, waitTimeoutLimit);
//       const writeValue = getRandomIntFromInterval(0, writeValueLimit);
//       const waitPromise = new Promise(((resolve, reject) => {
//         setTimeout(resolve, waitTimeout);
//       }));
//       if (operationType !== OperationTypeEnum.Read) {
//         return waitPromise.then(() => {
//           // todo here should be statistics record write (before lock acquire)
//           return lock.acquireWriteLock();
//         }).then(() => {
//           // todo here should be statistics record write (lock acquired)
//           setTimeout(() => {
//             value2 = writeValue;
//             lock.releaseWriteLock();
//             // todo here should be statistics record write (lock released)
//           }, operationTime);
//         });
//       } else {
//         return waitPromise.then(() => {
//           // todo here should be statistics record write (before lock acquire)
//           return lock.acquireReadLock();
//         }).then(() => {
//           // todo here should be statistics record write (lock acquired)
//           setTimeout(() => {
//             lock.releaseReadLock();
//             // todo here should be statistics record write (lock released)
//           }, operationTime);
//         });
//       }
//     });
//   });
// });

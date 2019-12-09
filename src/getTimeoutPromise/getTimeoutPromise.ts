// todo return Promise with method to stop timeout
export function getTimeoutPromise(timeout: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve, timeout);
  });
}

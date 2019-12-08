// todo idle add tests
export function isObjectEmpty(object: object): boolean {
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
}

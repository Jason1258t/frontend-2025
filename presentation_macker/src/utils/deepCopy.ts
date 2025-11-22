export const deepCopy = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepCopy(item)) as T;
  }

  if (typeof obj === "object") {
    const copied = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        copied[key] = deepCopy(obj[key]);
      }
    }
    return copied;
  }

  return obj;
};
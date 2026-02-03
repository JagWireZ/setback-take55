import * as uuid from "uuid";

export const generateLongId = () => {
  return uuid.v4();
}

export const generateShortId = () => {
  return uuid.v4().slice(0, 8)
}

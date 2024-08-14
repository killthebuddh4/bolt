import { Store } from "./Store.js";

export const getPretty = ({ store }: { store: Store }): boolean => {
  const pretty = store.options?.pretty;

  switch (pretty) {
    case undefined:
      return true;
    case "false":
      return false;
    case "true":
      return true;
    default:
      return pretty;
  }
};

import { Store } from "./Store.js";

export const setOptions = ({
  store,
  options,
}: {
  store: Store;
  options?: Store["options"];
}) => {
  store.options = options;
};

export const out = ({
  data,
  options,
}: {
  data: unknown;
  options: { pretty: boolean };
}) => {
  const json = (() => {
    if (options.pretty) {
      return JSON.stringify(data, null, 2);
    } else {
      return JSON.stringify(data);
    }
  })();

  console.log(json);
};

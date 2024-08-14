import { Command } from "commander";
import { getDefaultConfigPath } from "xm-lib/config/getDefaultConfigPath.js";
import { setActiveConfigPath } from "xm-lib/config/setActiveConfigPath.js";
import { optionsStore } from "./optionsStore.js";
import { setOptions } from "./setOptions.js";
import { optionsSchema } from "./optionsSchema.js";

export const x = new Command()
  .option(
    "-c, --config <config>",
    "Path to config file",
    getDefaultConfigPath(),
  )
  .option("--pretty [false]", "Pretty print JSON")
  .hook("preAction", async (cmd) => {
    const opts = optionsSchema.parse(cmd.opts());

    setOptions({
      store: optionsStore,
      options: { pretty: opts.pretty },
    });

    setActiveConfigPath({ activeConfigPath: opts.config });
  });

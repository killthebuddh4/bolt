import { Command } from "commander";
import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { resolve } from "xm-lib/config/alias/resolve.js";
import { createRpc } from "@killthebuddha/xm-rpc/api/createRpc.js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { readConfig } from "xm-lib/config/readConfig.js";
import { optionsStore } from "../x/optionsStore.js";
import { out } from "../../out.js";
import { getPretty } from "../x/getPretty.js";
import { optionsSchema } from "./optionsSchema.js";
import { getArguments } from "./getArguments.js";
import { createRpcStream } from "@killthebuddha/xm-rpc/api/createRpcStream.js";
import { rpcStreamTerminatorSchema } from "@killthebuddha/xm-rpc/rpc/rpcStreamTerminatorSchema.js";

export const rpc = new Command("rpc")
  .requiredOption(
    "-s, --server <server>",
    "Alias or address of the server to connect to.",
  )
  .requiredOption("-m, --method <method>", "Method to call.")
  .requiredOption(
    "--args <input>",
    "Either JSON arguments for method or a path to a JSON file containing the arguments.",
  )
  .option("--stream", "Expect a streaming response.")
  .description("Create a new conversation")
  .action(async (rawOpts) => {
    const opts = optionsSchema.parse(rawOpts);
    const config = await readConfig({});
    const wallet = new Wallet(config.privateKey);
    const client = await Client.create(wallet, { env: "production" });

    const rpcArgs = {
      server: { address: await resolve({ aliasOrSource: opts.server }) },
      client,
      forRoute: createRoute({
        createContext: (i) => i,
        method: opts.method,
        inputSchema: z.unknown(),
        outputSchema: z.unknown(),
        handler: async () => undefined,
      }),
    };

    const input = getArguments({ userInput: opts.args });

    const pretty = getPretty({ store: optionsStore });

    if (opts.stream) {
      const rpcStream = await createRpcStream(rpcArgs)({ input });

      for await (const response of rpcStream) {
        out({ data: response, options: { pretty } });
        if (rpcStreamTerminatorSchema.safeParse(response)) {
          break;
        }
      }
      rpcStream.return(null);
    } else {
      const rpcClient = createRpc(rpcArgs);
      const response = await rpcClient(input);
      out({ data: response, options: { pretty } });
    }
  });

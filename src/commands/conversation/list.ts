import { Command } from "commander";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { readConfig } from "xm-lib/config/readConfig.js";

export const list = new Command("list")
  .description("List your conversations.")
  .action(async () => {
    const config = await readConfig({});
    const wallet = new Wallet(config.privateKey);
    const client = await Client.create(wallet, { env: "production" });
    const conversations = await client.conversations.list();
    console.log(
      JSON.stringify(
        conversations.map((conversation) => {
          return {
            peerAddress: conversation.peerAddress,
            context: conversation.context,
          };
        }),
        null,
        2,
      ),
    );
  });

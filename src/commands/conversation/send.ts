import { Command } from "commander";
import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { readConfig } from "xm-lib/config/readConfig.js";
import { resolve } from "xm-lib/config/alias/resolve.js";

export const send = new Command("send")
  .requiredOption("-u, --user <user>", "Alias or address of the user.")
  .requiredOption("-m, --message <message>", "Message to send.")
  .option("--cid <conversation id>", "Conversation ID.")
  .description("Create a new conversation")
  .action(async (rawOpts) => {
    const opts = z
      .object({
        user: z.string(),
        cid: z.string().optional(),
        message: z.string().min(1),
      })
      .parse(rawOpts);
    const config = await readConfig({});
    const wallet = new Wallet(config.privateKey);
    const client = await Client.create(wallet, { env: "production" });
    const address = await resolve({ aliasOrSource: opts.user });
    const conversation = await client.conversations.newConversation(
      address,
      (() => {
        if (opts.cid === undefined) {
          return undefined;
        } else {
          return { conversationId: opts.cid, metadata: {} };
        }
      })(),
    );
    const sent = await conversation.send(opts.message);
    console.log(
      JSON.stringify({
        sentTo: {
          peerAddress: sent.conversation.peerAddress,
          context: sent.conversation.context,
        },
        message: opts.message,
      }),
      null,
      2,
    );
  });

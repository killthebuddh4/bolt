import { z } from "zod";
import { Command } from "commander";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { readConfig } from "xm-lib/config/readConfig.js";
import { resolve } from "xm-lib/config/alias/resolve.js";

const userAndCidSchema = z.object({
  user: z.string(),
  cid: z.string().optional(),
});

const onlyUserSchema = z.object({
  user: z.string().optional(),
  cid: z.never(),
});

const optionSchema = z.union([userAndCidSchema, onlyUserSchema]);

export const listen = new Command("listen")
  .description("Listen for new conversations")
  .option("-u, --user <user>", "Alias or address of the user.")
  .option("--cid <conversation id>", "Conversation ID.")
  .action(async (options) => {
    const opts = optionSchema.parse(options);
    const config = await readConfig({});
    const wallet = new Wallet(config.privateKey);
    const client = await Client.create(wallet, { env: "production" });

    if (opts.user === undefined) {
      const stream = await client.conversations.stream();
      for await (const conversation of stream) {
        console.log(
          JSON.stringify({
            peerAddress: conversation.peerAddress,
            context: conversation.context,
          }),
        );
      }
    } else {
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
      const stream = await conversation.streamMessages();
      for await (const message of stream) {
        console.log(
          JSON.stringify(
            {
              id: message.id,
              content: message.content,
            },
            null,
            2,
          ),
        );
      }
    }
  });

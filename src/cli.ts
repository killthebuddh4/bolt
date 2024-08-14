import { x } from "./commands/x/x.js";
import { conversation } from "./commands/conversation/conversation.js";
import { list as listConversations } from "./commands/conversation/list.js";
import { listen as listenForConversations } from "./commands/conversation/listen.js";
import { create as createConversation } from "./commands/conversation/create.js";
import { send } from "./commands/conversation/send.js";
import { rpc } from "./commands/rpc/rpc.js";

conversation.addCommand(listConversations);
conversation.addCommand(listenForConversations);
conversation.addCommand(createConversation);
conversation.addCommand(send);
x.addCommand(conversation);
x.addCommand(rpc);
x.parse();

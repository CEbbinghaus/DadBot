const replies = [
    "I'm proud of you son :)",
    "You are a disappointment to your Mother and I"
]
import { command } from "../definitions";

export default {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "proud",
        desk: "Asks the bot if he is proud of you",
        category: "Fun"
    },
    command: {
        weight: 500,
        regex: /proud/gi,
        run: (bot, message, settings) => {
            return message.reply(replies[Math.random() * replies.length | 0]);
        }
    }
} as command;
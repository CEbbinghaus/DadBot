import { command } from "../definitions";

const responses = [
    "That's kinda hot",
    "please please, you may only call me daddy behind closed doors."
]
export default {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "daddy",
        desk: "calls dad daddy ;)",
        category: "Fun"
    },
    command: {
        weight: 500,
        regex: /daddy/gi,
        run: (bot, message, settings) => {
            return message.reply(responses[Math.random() * responses.length | 0]);
        }
    }
} as command;
import Child from "child_process"
import {Confirm, Deny} from "../util/interractions"
export default {
    help: {
        perms: null,
        owner: true,
        server: false,
        name: "restart",
        desk: "Restarts the bot",
        category: "Admin"
    },
    command: {
        weight: 500,
        regex: /restart/gi,
        run: (bot, message, settings) => {
            bot.shard.broadcastEval("process.exit()");
        }
    }
}

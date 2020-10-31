import Child from "child_process"
import {Constants, Confirm, Deny} from "../util/interractions";
export default {
    help: {
        perms: null,
        owner: true,
        server: false,
        name: "exit",
        desk: "removes the bot from the current PM2 context",
        category: "Admin"
    },
    command: {
        weight: 500,
        regex: /exit/ig,
        run: (bot, message, settings) => {
            Child.exec("pm2 delete DadBot", (e, out, err) => {
                if (e) {
                    message.channel.send(e).then(() => {
                        Deny(message)
                    })
                } else {
                    Confirm(message)
                }
                return
            })
        }
    }
}
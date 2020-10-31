import Child from "child_process"
import {Constants, Confirm, Deny} from "../util/interractions"
export default {
    help: {
        perms: null,
        owner: true,
        server: false,
        name: "update",
        desk: "Updates the bot",
        category: "Admin"
    },
    command: {
        weight: 500,
        regex: /update/ig,
        run: (bot, message, settings) => {
            Child.exec("git pull", () => {
                Confirm(message);
            })
        }
    }
}
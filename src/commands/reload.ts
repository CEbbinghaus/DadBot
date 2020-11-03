import {Confirm} from "../util/interractions"
import fs from "fs"
import { command } from "../definitions";

export default {
    help: {
        perms: null,
        owner: true,
        server: false,
        name: "reloadCMD",
        desk: "Reloads all Commands",
        category: "Admin"
    },
    command: {
        weight: 500,
        regex: /(rld|reload)/ig,
        run: async (bot, message, settings) => {
            let reac = await message.react("🔄");
            await bot.shard.broadcastEval("this.LoadRules(); this.LoadCommands(); this.SetActivity();");
            await reac.remove();
            Confirm(message);
        }
    }
} as command;
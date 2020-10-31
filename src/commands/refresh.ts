import {Confirm, Deny, helpReact} from "../util/interractions"
import {TrueType} from "../util/utilities"
import {clearLogs} from "../util/utilities"
import {Client} from "discord.js"
import util from "util"

export default {
  help: {
    perms: null,
    owner: true,
    server: false,
    name: "refresh",
    desk: "Refreshes all of the Server Configs with an Updated Version",
    category: "Admin"
  },
  command: {
    weight: 500,
    regex: /refresh|ref/gi,
    run: async (bot, message, settings) => {
      delete require.cache[require.resolve("../util/classes.js")];
    //   await bot.DataBase.modifySchema(new Server(), (res, err) => {
    //     if (err)return helpReact(message, err);
    //     Confirm(message).then(() => {
    //       bot.shard.broadcastEval("process.exit()");
    //     })
    //   })
    }
  }
}
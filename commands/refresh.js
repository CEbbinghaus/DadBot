const {Confirm, Deny, helpReact} = require("../util/interractions");
const {TrueType} = require("../util/utilities")
const {clearLogs} = require("../util/utilities")
const {Client} = require("discord.js");
const util = require("util");
const {DataBase: db} = require("../util/database")

module.exports = {
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
    run: async (bot = new Client(), message, settings) => {
      delete require.cache[require.resolve("../util/classes.js")];
      const {Server} = require("../util/classes");
      await bot.DataBase.modifySchema(new Server(), (res, err) => {
        if (err)return helpReact(message, err);
        Confirm(message).then(() => {
          bot.shard.broadcastEval("process.exit()");
        })
      })
    }
  }
}
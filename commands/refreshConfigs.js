const {Confirm, Deny, helpReact} = require("../util/interractions");
const {clearLogs} = require("../util/utilities")
const {Client} = require("discord.js");
const {DataBase: db} = require("../util/database")
const getChanges = (a, b) => {
  let resultObj = {};
  for(let ak in a){
    let found = false;
    for(let bk in b){
      if(ak == bk)
      found = true;
    }
    if(!found){
      if (!resultObj["$unset"]) resultObj["$unset"] = {};
      resultObj["$unset"][ak] = 1;
    }
  }
  for (let bk in b) {
    let found = false;
    for (let ak in a) {
      if (ak == bk)
      found = true;
    }
    if (!found){
     if (!resultObj["$set"]) resultObj["$set"] = {};
      resultObj["$set"][bk] = b[bk];
    }
  }
  return resultObj;
}
module.exports = {
  help: {
    perms: null,
    owner: true,
    server: false,
    name: "refresh",
    desk: "Refreshes all of the Server Configs with an Updated Version"
  },
  command: {
    weight: 500,
    regex: /refresh|ref/gi,
    run: async (bot = new Client(), message, settings) => {
      clearLogs()
      let oldServer = require("../util/classes.js").Server;
      delete require.cache[require.resolve("../util/classes.js")];
      let newServer = require("../util/classes.js").Server;
      let DataBase = bot.DataBase;
      let Change = getChanges(new oldServer(), new newServer());
      if(Object.keys(Change).length == 0)return helpReact(message, "No Changes to be Made");
      DataBase.updateAll({}, Change, async err => {
        if(err != null)return helpReact(message, err.toString);
        else{
          await bot.shard.broadcastEval("this.DataBase.Cache.clear()");
          Confirm(message);
        }
      })
    }
  }
}
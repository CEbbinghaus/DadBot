const {Confirm, Deny, helpReact} = require("../util/interractions");
const {TrueType} = require("../util/utilities")
const {clearLogs} = require("../util/utilities")
const {Client} = require("discord.js");
const util = require("util");
const {DataBase: db} = require("../util/database")
const loopObjects = (a, b) => {
  let res = [];
  for(let ak in a){
    if(ak == "_id")continue;
    let found = false;
    for(let bk in b){
      if(ak == bk){
        if(typeof a[ak] == "object" && a[ak] != null)res.push([ak, loopObjects(a[ak], b[bk])]);
        found = true;
      }
    }
    if(!found){
      res.push([ak,a[ak]]);
    }
  }
  ResObj = {};
  return res;
}
const compressArray = (a = [], s = "") => {
  if(s.length != 0)s += ".";
  let res = [];
  for(let o of a){
    if(o.length != 2)continue;
    if(TrueType(o[1]) == "array"){
      res = res.concat(compressArray(o[1], s + o[0]));
    }else{
      res.push([s + o[0], o[1]]);
    }
  }
  return res;
}
const createObject = (a = []) => {
  let o = {};
  for(let i of a){
    if(i.length == 2){
      o[i[0]] = i[1];
    }
  }
  return o;
}
const getChanges = (a, b) => {
  let resultObj = {};
  let added = createObject(compressArray(loopObjects(b, a)));
  let removed = createObject(compressArray(loopObjects(a, b)));
  if(Object.keys(added).length)resultObj["$set"] = added;
  if(Object.keys(removed).length)resultObj["$unset"] = removed;
  return resultObj;
}
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
      const {
        Server
      } = require("../util/classes");
      await bot.DataBase.modifyShema(new Server(), (res, err) => {
        if (err)return helpReact(message, err);
        Confirm(message).then(() => {
          bot.shard.broadcastEval("process.exit()");
        })
      })
    }
  }
}
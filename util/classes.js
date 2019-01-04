const fs = require("fs");
const Rules = fs.readdirSync("./rules/").map(v => require("../rules/" + v));
function ServerSettings(o = {}){
  this.id = o.id || null;
  this.name = o.name || "";
  this.settings = {};
  for(let i in Rules){
    let rule = Rules[i];
    this.settings[rule.setting] = o.settings ? o.settings[rule.setting] : true;
  }
}
module.exports.Server = ServerSettings;
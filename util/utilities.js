const {helpReact} = require("./interractions");
module.exports.TrueType = v => {
  switch (typeof v) {
    case "object":
      if (v == null) return "null";
      if (v.length != undefined) return "array";
      return "object"
      break;
    case "number":
      if (isNaN(v)) return "nan";
      return "number";
      break;
    case "function":
      return "function"
      try {
        let k = new v();
        return v.name;
      } catch (err) {
        return "function"
      }
      break;
    default:
      return typeof v;
  }
}
class PermissionResponse{
  constructor(succeeded = false, error = ""){
    this.hasPerm = succeeded;
    this.message = error;
  }
}
module.exports.checkPermissions = (helpObj, message, bot) => {
  if(helpObj.owner && message.author.id != bot.owner.id)return false;
  if(helpObj.server && message.channel.type != "text"){
    return false;
  }else if(!helpObj.server){
    return true;
  }

  if (message.author.id == bot.owner.id){
    return true;
  }

  if (!helpObj.owner){
    if(message.member.hasPermission(helpObj.perms || []))
    return true;
  }
  return false;
}

module.exports.clearLogs = () => {
  console.log(Array(40).join("\n"));
}
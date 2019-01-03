function ServerSettings(o = {}){
  this.id = o.id || null;
  this.enabled = o.enabled || true;
  this.name = o.name || "";
  this.server = this.id ? true : false;
}
module.exports.Server = ServerSettings;
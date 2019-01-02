function ServerSettings(o){
  this.id = o.id;
  this.enabled = o.enabled || true;
  this.name = o.name;
}
module.exports.Server = ServerSettings;
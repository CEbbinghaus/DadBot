module.exports = {
  name: "Profanities",
  desk: "Tells People that ",
  setting: "PROFANITY",
  regex: /[^!@#$%^&*]*(cunt|faggot|asshole|shit|dick|fuck)[^!@#$%^&*]*/gi,
  execute: function (Bot, message, match) {
    message.channel.send(`Watch your Language`);
  }
}
export default {
  name: "Profanities",
  desk: "Tells People that they shouldnt say bad words",
  setting: "PROFANITY",
  regex: /[^!@#$%^&*]*(asshole|cunt|dick|faggot|fuck|shit)[^!@#$%^&*]*/gi,
  execute: function (Bot, message, match) {
    message.channel.send(`Watch your language`);
  }
}
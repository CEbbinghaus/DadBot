module.exports = {
  name: "im",
  desk: "Responds to any im (words) with Hi (words)",
  setting: "HIIMDAD",
  regex: /\bi([‘'`’\u2018\u2019]|)m\s(.+)/ig,
  execute: function(Bot, message, match){
    message.channel.send(`Hello ${match[1]}, I'm Dad!`);
  }
}
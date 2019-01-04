const {Confirm, Deny} = require("../util/interractions");
const {RichEmbed} = require("discord.js");
module.exports = {
    help: {
        perms: ["ADMINISTRATOR"],
        owner: false,
        server: true,
        name: "toggle",
        desk: "toggles a Serveer Setting. Use without anything else to get a list of all the toggles"
    },
    command: {
        weight: 500,
        regex: /toggle/ig,
        run: (bot, message, settings) => {
          let msg = message.content.toLowerCase();
          let DataBase = bot.DataBase;
          for (let rule of bot.rules){
            if(msg.indexOf(rule.setting.toLowerCase()) != -1){
              settings.settings[rule.setting] = !settings.settings[rule.setting];
              DataBase.update({id: message.guild.id}, settings);
              return message.channel.send(`Toggled ${rule.setting} to ${settings.settings[rule.setting]}`);
            }
          }
          let reply = new RichEmbed()
            .setTitle("Bot Settings:")
            .setColor("#DFF3E1");
          bot.rules.map(v => {
            reply.addField(`**${v.setting}**`, `${v.desk}
            Currently set to: **${settings.settings[v.setting]}**`)
          })
          message.channel.send(reply);
        }
    }
}
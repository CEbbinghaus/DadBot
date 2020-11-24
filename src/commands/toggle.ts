import {Confirm, Deny} from "../util/interractions"
import {MessageEmbed} from "discord.js"
import { command } from "../definitions";

export default {
    help: {
        perms: ["ADMINISTRATOR"],
        owner: false,
        server: true,
        name: "toggle",
        desk: "toggles a Server Setting. Use: *toggle [setting]*\nif you dont provide a setting it will list all possible settings instead",
        category: "Server"
    },
    command: {
        weight: 500,
        regex: /toggle/ig,
        run: (bot, message, settings) => {
          let msg = message.content.toLowerCase();
          let DataBase = bot.DataBase;

          for (let rule of bot.rules){
            if(msg.search(new RegExp(rule.setting, "gi")) != -1){
              settings.settings[rule.setting] = !settings.settings[rule.setting];
              DataBase.update({id: message.guild.id}, settings);
              return message.channel.send(`Toggled ${rule.setting} to ${settings.settings[rule.setting]}`);
            }
          }
          
          let reply = new MessageEmbed()
            .setTitle("Bot Settings:")
            .setColor("#DFF3E1");
          bot.rules.map(v => {
            reply.addField(`**${v.setting}**`, `${v.desk}
            Currently set to: **${settings.settings[v.setting]}**`)
          })
          message.channel.send(reply);
        }
    }
} as command;
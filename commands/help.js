const {Confirm} = require("../util/interractions");
const {checkPermissions} = require("../util/utilities")
const {RichEmbed} = require("discord.js");
const fs = require("fs");
module.exports = {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "help",
        desk: "makes dad give you a helping hand as to what he can do",
        category: "Utility"
    },
    command: {
        weight: 10,
        regex: /help/ig,
        run: (bot, message, settings) => {
            let reply = new RichEmbed()
            .setTitle("DadBot Repository")
            .setAuthor("DadBot", bot.user.avatarURL)
            .setColor("#34363C")
            .setURL("https://github.com/CEbbinghaus/DadBot")
            .addField("Help:", `**General:**
            Heya you asked for my help so let me give you a brief overview of what i can do.
            i function using regex so you can just include my commands instead of calling them.
            e.g\n\`@dadbot give me a dad joke\` opposed to \`!dadjoke\``);
            let commandMap = {};
            bot.commands.map(c => {
                if(!checkPermissions(c.help, message, bot) && c.help.name)return;
                let type = c.help.category || "Misc|WIP";
                if(commandMap[type] == undefined)commandMap[type] = [];
                commandMap[type].push(`**${c.help.name}** : \`${c.help.desk}\``);
            });
            if(message.author.id == bot.owner.id && message.content.indexOf("raw") != -1){
                let t = "";
                for (let category in commandMap) {
                    t += `## ${category}\n`
                    t += commandMap[category].map(v => "* " + v).join("\n") + "\n";
                }
                message.reply("```" + t + "```");
                return;
            }
            for(let category in commandMap){
                reply.addField(`**${category}**`, commandMap[category].join("\n"));
            }
            reply.addField("Invites", `If you need any Additional Assistance join my owners Bot server: https://discord.gg/KBrxfzq.
            If you want to Invite me you can use this Link: https://goo.gl/gq4t6z`)
            message.author.send(reply);
            Confirm(message);
            return
        }
    }
}
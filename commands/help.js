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
        desk: "makes dad give you a helping hand as to what he can do"
    },
    command: {
        weight: 10,
        regex: /help/ig,
        run: (bot, message, settings) => {
            let reply = new RichEmbed()
            .setTitle("Help")
            .setAuthor("DadBot", bot.user.avatarURL)
            .setColor("95d4ed")
            .addField("General:", `
            Heya you asked for my help so let me give you a brief overview of what i can do.
            i function using regex so you can just include my commands instead of calling them.
            e.g\n\`@dadbot give me a dad joke\` opposed to \`!dadjoke\``);
            let commands = fs.readdirSync("./commands/").map(v => {
                let c = require("./" + v);
                if(!checkPermissions(c.help, message, bot) && c.help.name)return null;
                return `**${c.help.name}** : \`${c.help.desk}\`\n`
            });
            reply.addField("Commands", commands.join(""));
            reply.addField("Invites", `If you need any Additional Assistance join my owners Bot server: https://discord.gg/KBrxfzq.
            If you want to Invite me you can use this Link: https://discordapp.com/oauth2/authorize?client_id=397646331415494694&scope=bot&permissions=314432`)
            message.author.send(reply);
            Confirm(message);
            return
        }
    }
}
const {RichEmbed} = require("discord.js");
const {Confirm} = require("../util/interractions");
module.exports = {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "info",
        desk: "Provides some Information on the Bot"
    },
    command: {
        weight: 500,
        regex: /info/gi,
        run: async (bot, message, settings) => {
            let TotalServers = (await bot.shard.broadcastEval('this.guilds.size')).reduce((prev, val) => prev + val, 0)
            let TotalMembers = (await bot.shard.broadcastEval('this.GetUsers()')).reduce((prev, val) => prev + val, 0)
            let Members = 0;
            bot.guilds.forEach(g => Members += g.memberCount);
            let info = new RichEmbed()
                .setTitle("Info")
                .setColor("edaa63")
                .setAuthor("DadBot", bot.user.avatarURL)
                .addField("General:", "Hi im DadBot. i do things you Dad would do ~~if you had one(coz lets be honest. why else would you invite him)~~. with any help just mention me and include the word help")
                .addField("Shard:", `Current Shard ID: ${bot.shard.id}
                Users: ${Members}
                Servers: ${bot.guilds.size}`)
                .addField("Bot:", `Users: ${TotalMembers}
                Servers: ${TotalServers}
                Author: ${bot.owner}`)
                .addField("Invites:", `If you want any further Support with the bot or just wanna chill with my author join this server: https://discord.gg/KBrxfzq

                If you instead want to invite Me to your server you can use this link: https://goo.gl/gq4t6z`)
            message.author.send(info);
            Confirm(message);
        }
    }
}
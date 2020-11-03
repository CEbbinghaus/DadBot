import {MessageEmbed} from "discord.js"
import {Confirm} from "../util/interractions"
import {clearLogs} from "../util/utilities"
import { command } from "../definitions";

export default {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "info",
        desk: "Provides some Information on the Bot",
        category: "Utility"
    },
    command: {
        weight: 500,
        regex: /info/gi,
        run: async (bot, message, settings) => {
            let TotalServers = await bot.GetTotalServers()
            let TotalMembers = await bot.GetTotalUsers()
            let Members = 0;
            bot.guilds.cache.forEach(g => Members += g.memberCount);
            let info = new MessageEmbed()
                .setTitle("Info")
                .setColor("#34363C")
                .setAuthor("DadBot", bot.user.avatarURL())
                .addField("General:", "Hi im DadBot. i do things your Dad would do ~~if you had one (coz lets be honest. why else would you invite him)~~. with any help just mention me and include the word help")
                .addField("Shard:", `Current Shard ID: ${bot.shard.ids[0] + 1}/${bot.shard.count}
                Users: ${Members}
                Servers: ${bot.guilds.cache.size}`)
                .addField("Bot:", `Users: ${TotalMembers}
                Servers: ${TotalServers}
                Author: ${bot.owner}`)
                .addField("Invites:", `If you want any further Support with the bot or just wanna chill with my author join this server: https://discord.gg/KBrxfzq

                If you instead want to invite Me to your server you can use this link: https://goo.gl/gq4t6z`)
            message.author.send(info);
            Confirm(message);
            bot.SetActivity();
        }
    }
} as command;
import fetch from "node-fetch"
import {MessageEmbed} from "discord.js"
import { command } from "../definitions";
export default {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "dad joke",
        desk: "makes Dad tell you a good ol Dad Joke",
        category: "Fun"
    },
    command: {
        weight: 480,
        regex: /(dad\s*joke)/ig,
        run: (bot, message, settings) => {
			fetch("https://www.reddit.com/r/dadjokes.json?limit=1000")
			.then(res => res.json())
            .then(f => {
                let url = f.data.children[Math.ceil(Math.random() * f.data.children.length - 1)].data;
                let joke = new MessageEmbed()
                    .setTitle("A Dad Joke")
                    .setColor("#34363C")
                    .addField(url.title, url.selftext.toString());
                message.channel.send(joke);
             })
        }
    }
} as command;
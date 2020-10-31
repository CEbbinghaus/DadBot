import fetch from "node-fetch"
import {MessageEmbed} from "discord.js"
export default {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "good joke",
        desk: "makes dad tell you aactually good joke",
        category: "Fun"
    },
    command: {
        weight: 450,
        regex: /(?:joke.*(good)|(better|good).*joke)/ig,
        run: (bot, message, settings) => {
			//Snek.get()
			fetch("https://www.reddit.com/r/jokes/top.json?t=monthlimit=1000")
			.then(res => res.json())
            .then(f => {
                 let url = f.data.children[Math.ceil(Math.random() * f.data.children.length - 1)].data;
                 const reply = new MessageEmbed()
                    .setTitle("An actually Good Joke")
                    .setColor("#34363C")
                     .addField(url.title, url.selftext.toString())
                 message.channel.send(reply);
             })
        }
    }
}
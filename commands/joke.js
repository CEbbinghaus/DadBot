const Snek = require("snekfetch");
const {RichEmbed} = require("discord.js");
module.exports = {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "joke",
        desk: "makes dad tell you a joke",
        category: "Fun"
    },
    command: {
        weight: 500,
        regex: /joke/ig,
        run: (bot, message, settings) => {
            Snek.get("https://www.reddit.com/r/jokes.json?limit=1000")
            .then(res => {
                const f= JSON.parse(res.text)
                let url = f.data.children[Math.ceil(Math.random() * f.data.children.length - 1)].data;
                const reply = new RichEmbed()
                    .setTitle("A Joke")
                    .setColor("#34363C")
                    .addField(url.title, url.selftext.toString());
                 message.channel.send(reply);
             })
        }
    }
}
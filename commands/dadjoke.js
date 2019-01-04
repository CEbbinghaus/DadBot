const Snek = require("snekfetch");
const {RichEmbed} = require("discord.js");
module.exports = {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "dad joke",
        desk: "makes Dad tell you a good ol Dad Joke"
    },
    command: {
        weight: 480,
        regex: /(dad\s*joke)/ig,
        run: (bot, message, settings) => {
            Snek.get("https://www.reddit.com/r/dadjokes.json?limit=1000")
            .then(res => {
                const f = JSON.parse(res.text)
                let url = f.data.children[Math.ceil(Math.random() * f.data.children.length - 1)].data;
                let joke = new RichEmbed()
                    .setTitle("A Dad Joke")
                    .setColor("#34363C")
                    .addField(url.title, url.selftext.toString());
                message.channel.send(joke);
             })
        }
    }
}
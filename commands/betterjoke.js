const Snek = require("snekfetch");
const {RichEmbed} = require("discord.js")
module.exports = {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "good joke",
        desk: "makes dad tell you aactually good joke"
    },
    command: {
        weight: 450,
        regex: /(?:joke.*(good)|(better|good).*joke)/ig,
        run: (bot, message, settings) => {
            Snek.get("https://www.reddit.com/r/jokes/top.json?t=monthlimit=1000")
            .then(res => {
                const f= JSON.parse(res.text);
                 let url = f.data.children[Math.ceil(Math.random() * f.data.children.length - 1)].data;
                 const reply = new RichEmbed()
                    .setTitle("An actually Good Joke")
                    .setColor("#34363C")
                     .addField(url.title, url.selftext.toString())
                 message.channel.send(reply);
             })
        }
    }
}
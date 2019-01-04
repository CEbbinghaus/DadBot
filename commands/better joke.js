const Snek = require("snekfetch");
module.exports = {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "better joke",
        desk: "makes dad tell you a better joke"
    },
    command: {
        weight: 450,
        regex: /(?:joke.*(good)|(better|good).*joke)/ig,
        run: (bot, message, settings) => {
            Snek.get("https://www.reddit.com/r/jokes/top.json?t=monthlimit=1000")
            .then(res => {
                const f= JSON.parse(res.text)
                 let url = f.data.children[Math.ceil(Math.random() * f.data.children.length - 1)].data;
                 message.channel.send(url.title + "\n\n" + url.selftext.toString());
             })
        }
    }
}
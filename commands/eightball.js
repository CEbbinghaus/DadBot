const awnsers = ["yes", "no", "maybe", "probably", "unlikely"];
module.exports = {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "?",
        desk: "Asks Dad a question"
    },
    command: {
        weight: 1000,
        regex: /\?$/gi,
        run: (bot, message, settings) => {
            return message.reply(awnsers[Math.random() * awnsers.length | 0]);
        }
    }
}
    
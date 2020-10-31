const awnsers = ["yes", "no", "maybe", "probably", "unlikely"];
export default {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "?",
        desk: "Asks Dad a question",
        category: "Fun"
    },
    command: {
        weight: 1000,
        regex: /\?$/gi,
        run: (bot, message, settings) => {
            return message.reply(awnsers[Math.random() * awnsers.length | 0]);
        }
    }
}
    
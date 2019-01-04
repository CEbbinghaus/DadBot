module.exports = {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "mom gay",
        desk: "makes the bot react to the age old your mom gay",
        category: "Fun"
    },
    command: {
        weight: 500,
        regex: /(mom.*gay|gay.*mom)/gi,
        run: (bot, message, settings) => {
            return message.reply("Ur sister a Mister!");
        }
    }
}
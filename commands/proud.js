const replies = [
    "I'm proud of you son :)",
    "You are a Dissapointment to your Mother and I"
]
module.exports = {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "proud",
        desk: "Asks the bot if he is proud of you"
    },
    command: {
        weight: 500,
        regex: /proud/gi,
        run: (bot, message, settings) => {
            return message.reply(replies[Math.random() * replies.length | 0]);
        }
    }
}
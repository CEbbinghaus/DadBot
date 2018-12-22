module.exports = {
    help: {
        perms: null,
        owner: true,
        server: false,
        name: "eval",
        desk: "Evaulates Code"
    },
    command: {
        weight: 500,
        regex: /eval/gi,
        run: async (bot, message, settings) => {
            let code = message.content.slice(message.content.indexOf("eval") + 4, message.content.length);
            try{
                let r = eval(code);
                message.reply(r);
            }catch(err){
                message.reply(err.message);
            }
        }
    }
}
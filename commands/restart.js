const Child = require("child_process");
const {Confirm, Deny} = require("../util/interractions");
module.exports = {
    help: {
        perms: null,
        owner: true,
        server: false,
        name: "restart",
        desk: "Restarts the bot"
    },
    command: {
        weight: 500,
        regex: /restart/,
        run: (bot, message, settings) => {
            Child.exec("pm2 restart DadBot", (e, out, err) => {
                if(e){
                    message.channel.send(e).then(() => {
                        Deny(message);
                    })
                }else{
                    Confirm(message);
                }
            })
        }
    }
}

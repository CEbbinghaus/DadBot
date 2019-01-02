const {Client} = require("discord.js");
const {helpReact} = require("./util/interractions")
const {checkPermissions} = require("./util/utilities");
const {CachedDataBase} = require("./util/database");
const {Server} = require("./util/classes")
//Importing Settings Such as Token
const Settings = require("./settings.json");
const dbl = new (require('dblapi.js'))(Settings.DBLToken);
var fs = require('fs');
const DataBase = new CachedDataBase(Settings.Host, "DadBot", Settings.Username, Settings.Password);

const Bot = new Client();

Bot.commands = [];
Bot.DataBase = DataBase;


Bot.GetUsers = () => {
    return Bot.guilds.map(g => g.memberCount).reduce((a, b) => a +b);
}
Bot.GetTotalUsers = async () => {
    return (await Bot.shard.broadcastEval('this.GetUsers()')).reduce((prev, val) => prev + val, 0);
}
Bot.SetActivity = async () => {
    let servers = await Bot.GetTotalServers();
    Bot.user.setActivity(`${servers} Servers`, { type: "WATCHING" });
    dbl.postStats(servers)
        .then(() => console.log("Posted Stats"))
        .catch(error => console.log(error));
}
Bot.GetTotalServers = async () => {
    return (await Bot.shard.broadcastEval('this.guilds.size')).reduce((prev, val) => prev + val, 0);    
}

Bot.LoadCommands = () => {
    Bot.commands = fs.readdirSync("./commands/").map(v => {
        return require("./commands/" + v);
    }).sort((a, b) => a.command.weight - b.command.weight);
}

//Triggers when the bot is logged in
Bot.on('ready', async () =>{
    Bot.fetchApplication().then(a => {
        Bot.owner = a.owner;
    })
    Bot.LoadCommands();
    //Logging amount of servers and members
    console.log(`${Bot.user.username} is online on ${Bot.guilds.size} servers for a total of ${Bot.GetUsers()} members`);
    if(Bot.shard.id + 1 == Bot.shard.count){
        Bot.shard.broadcastEval("this.SetActivity()");
    }
})
//Triggers when the Bot recives a message
Bot.on('message',async Message => {
    //Checking if the Message was sent By a Bot
    if(Message.author.bot)return;

    let server = await DataBase.read({id: Message.guild.id});
    if (!server) {
        server = new Server(Message.guild);
        DataBase.write(server);
    }
    //makes sure that the bot is mentioned
    if(Message.isMentioned(Bot.user) || Message.channel.type === "dm"){
        //checks if the message was sent By the Dev 
        if(!Bot.owner){
            Bot.owner = await Bot.fetchApplication().owner;
        }
        let avaliableCommands = Bot.commands.filter(c => checkPermissions(c.help, Message, Bot));
        for(let i in avaliableCommands){
            let cmd = avaliableCommands[i];
            if(cmd.command.regex != null){
                if(cmd.command.regex.test(Message)){
                    try{
                        cmd.command.run(Bot, Message, server);
                        return;
                    }catch(err){
                        helpReact(Message, err.toString());
                    }
                }
            }
        }

        //checks if you are asking the bot to die
        // if(/(kys|die|fuck\s+(off|you)|kill\s+your\s+self)/gi.teste(Message)){
        //     Message.channel.send(new Attachment("https://www.wikihow.com/images/b/b2/User-Completed-Image-Tie-a-Noose-2017.01.05-18.21.58.0.png"));
        // }

    }
    //checks if the server has the bot enabled
    if (Message.channel.type != "dm" && server.enabled === true) {
        //if so then it checks if the message has im [Something] in it
        let k = /\b(im|i'm|i`m|i‘m)\s(.+)/ig.exec(Message.content);
        if(!k)return;
        //sends the message back
        Message.channel.send(`Hello ${k[2]}, i'm Dad!`);
    }
})

//Triggers when the bot gets invited to a new Server
Bot.on('guildCreate', g => {
    let server = new Server(g);
    DataBase.write(server, () => {
        g.owner.createDM().then(o => {
            o.send("heya im Dadbot i will do stupid shit. if you want me to stop just send **@DadBot stop**, and you want me to resume my shenanigans then use **start** instead");
        });
    });
    Bot.setActivity();
})
Bot.on("guildDelete", async g => {
    if(await DataBase.exists({id: g.id})){
        DataBase.delete({id: g.id});
        Bot.setActivity();
    }
})

//Watches out for unhandled rejections and loggs them
process.on("unhandledRejection", console.error);


//Loggs the bot into discord
Bot.login(Settings.token1);

Number.prototype.round = function(){
    return Math.round(this)
}

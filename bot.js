const {Client} = require("discord.js");
const {helpReact} = require("./util/interractions")
const {checkPermissions} = require("./util/utilities");
const {CachedDataBase} = require("./util/database");
const {Server} = require("./util/classes");
//Importing Settings Such as Token
const Settings = require("./settings.json");
const dbl = new (require('dblapi.js'))(Settings.DBLToken);
var fs = require('fs');
const DataBase = new CachedDataBase(Settings.Host, "DadBot", Settings.Username, Settings.Password);

const Bot = new Client();
Bot.inDevelopment = Settings.DEV;
Bot.commands = [];
Bot.rules = []
Bot.DataBase = DataBase;
Bot.UnderMaintenence = Settings.maintenence || false;

Bot.GetUsers = () => {
    return Bot.guilds.map(g => g.memberCount).reduce((a, b) => a +b);
}
Bot.GetTotalUsers = async () => {
    return (await Bot.shard.broadcastEval('this.GetUsers()')).reduce((prev, val) => prev + val, 0);
}
Bot.SetActivity = async () => {
    if(Bot.UnderMaintenence)
        Bot.user.setActivity("Currently Under Maintenence", { type: "PLAYING" });
    else{
        let servers = await Bot.GetTotalServers();
        Bot.user.setActivity(`${servers} Servers`, { type: "WATCHING" });
    }
}
Bot.SetMaintenence = async (m, b) => {
    Bot.UnderMaintenence = m;
    if(b)return;
    await Bot.shard.broadcastEval(`if(this.shard.id != ${Bot.shard.id})this.SetMaintenence(${m}, true);this.SetActivity();`)
    Bot.SetActivity();
    return;
}
Bot.GetTotalServers = async () => {
    return (await Bot.shard.broadcastEval('this.guilds.size')).reduce((prev, val) => prev + val, 0);    
}

Bot.LoadCommands = () => {
    Bot.commands = fs.readdirSync("./commands/").map(v => {
        delete require.cache[require.resolve("./commands/" + v)];
        return require("./commands/" + v);
    }).sort((a, b) => a.command.weight - b.command.weight);
}
Bot.LoadRules = () => {
    Bot.rules = fs.readdirSync("./rules/").map(v => {
        delete require.cache[require.resolve("./rules/" + v)];
        return require("./rules/" + v);
    });
}
Bot.ready = false;
//Triggers when the bot is logged in
Bot.on('ready', async () =>{
    Bot.fetchApplication().then(a => {
        Bot.owner = a.owner;
    })
    Bot.LoadCommands();
    Bot.LoadRules();
    //Logging amount of servers and members
    console.log(`Started Shard ${Bot.shard.id} on ${Bot.guilds.size} servers for a total of ${Bot.GetUsers()} members`);
    if(!Bot.inDevelopment)dbl.postStats(Bot.guilds.size, Bot.shard.id, Bot.shard.count)
        .then(() => console.log("Published Stats to DBL"));
    Bot.SetActivity()
    await Bot.DataBase.modifyShema(new Server());
    Bot.ready = true;
})
//Triggers when the Bot recives a message
Bot.on('message',async Message => {
    console.log("Message Recieved: " + Message.content);
    if(!Bot.owner || !Bot.ready)return;
    //Checking if the Message was sent By a Bot
    if(Message.author.bot)return;
    if((Bot.UnderMaintenence || Bot.inDevelopment) && Message.author.id != Bot.owner.id)return;

    let server = Message.channel.type == "dm" ? new Server() : await DataBase.read({id: Message.guild.id});
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
                        let e = cmd.command.run(Bot, Message, server)
                        if(e instanceof Promise)e.catch(err => {
                            helpReact(Message, err.toString());
                        })
                        return;
                    }catch(err){
                        helpReact(Message, err.toString());
                    }
                }
            }
        }
    }
    let rules = Bot.rules.filter(v => server.settings[v.setting] == true);
    for(let rule of rules){
        let results = rule.regex.exec(Message.content);
        if(results){
            results.shift();
            rule.execute(Bot, Message, results);
        }
    }
})
//Triggers when the bot gets invited to a new Server
Bot.on('guildCreate', g => {
    let server = new Server(g);
    DataBase.write(server, () => {
        g.owner.createDM().then(o => {
            o.send("heya im Dadbot i will do stupid shit. if you want me to stop just send **@DadBot stop**, and you want me to resume my shenanigans then use **start** instead");
        });
        Bot.SetActivity();
    });
})

Bot.on("guildDelete", async g => {
    if(await DataBase.exists({id: g.id})){
        DataBase.delete({id: g.id});
        Bot.SetActivity();
    }
})


//Loggs the bot into discord
Bot.login(Settings.token);
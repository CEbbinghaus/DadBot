const {Client, RichEmbed, Attachment} = require("discord.js");
const {Confirm, helpReact} = require("./util/interractions")
const {checkPermissions} = require("./util/utilities");
const Child = require("child_process");

//Importing Settings Such as Dev ID and Token
const Settings = require("./settings.json");
//Importing Bot Name
const Package = require("./package.json");
const Snek = require("snekfetch");
var fs = require('fs');
const File = "./servers.json";

const Bot = new Client();

Bot.ServerMap = {};
Bot.commands = [];

Bot.SaveServers = (c) => {
    fs.writeFile(File, JSON.stringify(Bot.ServerMap), () => {
        c();
    });
}

Bot.LoadCommands = () => {
    Bot.commands = fs.readdirSync("./commands/").map(v => {
        return require("./commands/" + v);
    }).sort((a, b) => a.command.weight - b.command.weight);
}

//Triggers when the bot is logged in
Bot.on('ready', () =>{
    Bot.fetchApplication().then(a => {
        Bot.owner = a.owner
    })
    let Members = 0;
    //Adding onto the Member Count
    Bot.guilds.forEach(g => Members += g.memberCount);``
    //Logging amount of servers and members
    console.log(`${Package.name} is online on ${Bot.guilds.size} servers for a total of ${Members} members`);
    
    Bot.LoadCommands();
    fs.readFile(File, (err, data) => {
        if (err) throw err;
        Bot.ServerMap = JSON.parse(data)
    });
})

//Triggers when the Bot recives a message
Bot.on('message',async Message => {
    //Checking if the Message was sent By a Bot
    if(Message.author.bot)return;

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
                        cmd.command.run(Bot, Message);
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
    if(Message.channel.type != "dm" && Bot.ServerMap[Message.guild.id] === true){

        //if so then it checks if the message has im [Something] in it
        let k = /\b(im|i'm|i`m|i‘m)\s(.+)/ig.exec(Message.content);
        if(!k)return;
        //sends the message back
        Message.channel.send(`Hello ${k[2]}, i'm Dad!`);
    }
})

//Triggers when the bot gets invited to a new Server
Bot.on('guildCreate', g => {
    //Sends the Owner a Dm telling him how to stop the Bot
    g.owner.createDM().then(o => {
        o.send("heya im Dadbot i will do stupid shit. if you want me to stop just send **@DadBot stop**, and you want me to resume my shenanigans then use **start** instead of stop");
    });
    //Sets the ServerID to true so the bot is enabled
    Bot.ServerMap[g.id] = true;
    Bot.SaveServers();
})

//Watches out for unhandled rejections and loggs them
process.on("unhandledRejection", console.error);


//Loggs the bot into discord
Bot.login(Settings.token);

Number.prototype.round = function(){
    return Math.round(this)
}

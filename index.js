const Discord = require("discord.js");
const Child = require("child_process");

//Importing Settings Such as Dev ID and Token
const Settings = require("./settings.json");
//Importing Bot Name
const Package = require("./package.json");
const Bot = new Discord.Client();
const Snek = require("snekfetch");

//This is so that server owners can toggle the bot off without having to kick him
var ServerMap = new Map();

//Triggers when the bot is logged in
Bot.on('ready', () =>{
    let Members = 0;
    //Adding onto the Member Count
    Bot.guilds.forEach(g => Members += g.memberCount);
    //Loggint amount of servers and members
    console.log(`${Package.name} is online on ${Bot.guilds.size} servers for ServerMap total of ${Members} members`);
    //setting all server id's to true so the bot is enabled by default
    Bot.guilds.forEach(g => {ServerMap.set(g.id, true)});
})


//Triggers when the Bot recives a message
Bot.on('message', Message => {
    //Checking if the Message was sent By a Bot
    if(Message.author.bot)return;

    //Checking if the message is in a dm to the bot. if so then it simply gives you its invite link
    if(Message.channel.type == "dm"){
        Message.channel.send(`Here is my Invite Code: https://discordapp.com/oauth2/authorize?client_id=397646331415494694&scope=bot&permissions=314432`);
    }

    //makes sure that the bot is mentioned
    if(Message.isMentioned(Bot.user)){

        //checks if the word dadjoke appears somewhere in the message
        if(/(dad(\s+|)joke)/ig.test(Message)){
            //if so then it fetches a random dadjoke off of reddit and sends it into the chat
            Snek.get("https://www.reddit.com/r/dadjokes.json?limit=1000")
            .then(res => {
                const f= JSON.parse(res.text)
                 let url = f.data.children[Math.ceil(Math.random() * f.data.children.length - 1)].data;
                 let joke = new Discord.RichEmbed()
                 .setTitle("DadJoke:")
                 .setColor("960ddb")
                 .addField(url.title, url.selftext.toString());
                 Message.channel.send(joke);
             })
        }

        if(/(kys|die|fuck\soff|kill\syour\self)/gi.test(Message)){
            let reply = new Discord.RichEmbed()
            .setImage("https://www.wikihow.com/images/b/b2/User-Completed-Image-Tie-a-Noose-2017.01.05-18.21.58.0.png");
            Message.channel.send(reply);
        }

        //checks if the message was sent By the Dev
        if(Message.author.id == Settings.id){
            //allows for the dev to remotely shut off the bot
            if(/exit/ig.test(Message)){
                Child.exec("pm2 delete DadBot", (e, out, err) => {
                    Message.reply("now exiting  " + out);
                })
            }
        }
        //checks if the messge was sent by the server owner or Bot Dev
        if(Message.author.id == Message.guild.owner.id || Message.author.id == Settings.id){
            //Stops the bot from Sending Messages By setting the server id to false in the ServerMap we created
            if(/stop/ig.test(Message)){
                ServerMap.set(Message.guild.id, false);
                Message.reply("ok i will stop");
            }
            else
            //Sets the server ID to true so the bot continues spamming chat
            if(/start/ig.test(Message)){
                ServerMap.set(Message.guild.id, true);
                Message.reply("Gonna Wreck this server");
            }
        }
    }

    //checks if the server has the bot enabled
    if(ServerMap.get(Message.guild.id)){

        //if so then it checks if the message has im [Something] in it
        let k = /\b(im|i'm)\s(.+)/ig.exec(Message.content);
        if(!k)return;

        //if so then it sends a reply
        Message.channel.send(`Hello ${k[2]} i'm Dad`);
    }
})

//Triggers when the bot gets invited to a new Server
Bot.on('guildCreate', g => {
    //Sends the Owner a Dm telling him how to stop the Bot
    g.owner.createDM().then(Discord => {
        Discord.send("heya im Dadbot i will do stupid shit. if you want me to stop just send **@DadBot stop**, and you want me to resume my shenanigans then use **start** instead of stop");
    });
    //Sets the ServerID to true so the bot is enabled
    ServerMap.set(g.id, true);
})

//Watches out for unhandled rejections and loggs them
process.on("unhandledRejection", console.error);


//Loggs the bot into discord
Bot.login(Settings.token);
const d = require("discord.js");
const child = require("child_process");
const s = require("./settings.json")
const p = require("./package.json")
const b = new d.Client()
var a = new Map();
b.on('ready', () =>{
    child.exec("pm2 start . --name='DadBot'", (e, out, err) => {
        console.log("started DadBot with pm2", out, err);
        process.exit(0)
    })
    let m = 0;
    b.guilds.forEach(g => m += g.memberCount)
    console.log(`${p.name} is online on ${b.guilds.size} servers for a total of ${m} members`)
    b.guilds.forEach(g => {a.set(g.id, true)})
})
b.on('message', m => {
    if(m.author.bot)return;
    if(m.isMentioned(b.user)){
        if(m.author.id == s.id){
            if(/Exit/ig.test(m)){
                m.reply("now exiting");
                child.exec("pm2 delete DadBot", (e, out, err) => {
                    console.log(e, out, err);
                }).addListener("exit", () => process.exit(0))
            }
        }
        if(m.author.id == m.guild.owner.id || m.author.id == s.id){
            if(/stop/ig.test(m)){
                a.set(m.guild.id, false);
                m.reply("ok i will stop");
            }else if(/start/ig.test(m)){
                a.set(m.guild.id, true);
                m.reply("Gonna Wreck this server");
            }
        }
    }
    if(a.get(m.guild.id)){
        let k = /\b(im|i'm) (.+)/ig.exec(m);
        if(!k)return;
        m.channel.send(`Hello ${k[2]} i'm Dad`);
    }
})
b.on('guildCreate', g => {
    g.owner.createDM().then(d => {
        d.send("heya im Dadbot i will do stupid shit. if you want me to stop just send **@DadBot stop**, and you want me to resume my shenanigans then use **start** instead of stop");
    })
    a.set(g.id, true);
})

b.login(s.token)
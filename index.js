const d = require("discord.js");
const b = new d.Client()
var a = new Map();
b.on('message', m => {
    if(m.author.bot)return;
    if(m.author.id == m.guild.owner.id){
        if(m.isMentioned(b.user)){
            if(/stahp/ig.test(m)){
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
        d.send("heya im Dadbot i will do stupid shit. if you want me to stop just send **@DadBot stahp**, and you want me to resume my shenanigans then use **start** instead of stahp");
    })
    a.set(g.id, true);
})
b.login("YourTokenhere");
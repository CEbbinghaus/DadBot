const {Confirm, Deny} = require("../util/interractions");
const {DataBase} = require("../util/database")
module.exports = {
  help: {
    perms: null,
    owner: true,
    server: false,
    name: "refresh",
    desk: "Refreshes all of the Server Configs with an Updated Version"
  },
  command: {
    weight: 500,
    regex: /refresh|ref/gi,
    run: async (bot, message, settings) => {
      delete require.cache[require.resolve("../util/classes.js")];
      let {Server} = require("../util/classes.js");
      let db = bot.DataBase;
      let guilds = (await bot.shard.broadcastEval(`this.guilds.array()`)).reduce((a, b) => a.concat(b));
      let reply = await message.channel.send(`Starting the Refreshing of ${guilds.length} guilds`);
      for(let guildIndex in guilds){
        let guild = guilds[guildIndex];
        let exists = await db.exists({id: guild.id});
        console.log(exists, guild.id);
        if (exists){
          db.update({id: guild.id}, new Server(Object.assign(guild, db.read({id: guild.id}))));
          reply.edit(`Fixed ${guildIndex} / ${guilds.length} guilds`);
        }else{
          db.write(new Server(guild));
          reply.edit(`Fixed ${guildIndex } / ${guilds.length} guilds`);
        }
      }
      reply.edit("Done! Fixed Every Guild")
    }
  }
}
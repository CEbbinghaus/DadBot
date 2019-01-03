const { ShardingManager } = require('discord.js');
const Settings = require("./settings.json");
const manager = new ShardingManager('./bot.js', { token: Settings.token});

manager.spawn();
// manager.on('launch', shard => console.log(`Launched shard ${shard.id}`));
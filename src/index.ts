import { ShardingManager } from "discord.js";
import * as Settings from "./settings.json";

process.chdir(__dirname);

const manager = new ShardingManager("./bot.js", { token: Settings.token });
process.on("unhandledRejection", (v) => {
	//@ts-ignore
	console.log(v.body);
});
manager.spawn();
// manager.on('launch', shard => console.log(`Launched shard ${shard.id}`));

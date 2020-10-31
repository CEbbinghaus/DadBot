import fs from "fs"
import Settings from "../settings.json"
export default {
  help: {
    perms: null,
    owner: true,
    server: false,
    name: "maintenence",
    desk: "Toggles the bot's Maintenence Mode",
    category: "Admin"
  },
  command: {
    weight: 5,
    regex: /maintain|maintenence/gi,
    run: async (Bot, message, settings) => {
      await Bot.SetMaintenence(!Bot.UnderMaintenence);
      Settings.maintenence = Bot.UnderMaintenence;
      let text = JSON.stringify(Settings);
      if (!text) return message.reply("NO");
      fs.writeFile("./settings.json", text, () => {
        message.channel.send(`Toggled Maintenece to: **${Bot.UnderMaintenence}**`);
      });
    }
  }
}
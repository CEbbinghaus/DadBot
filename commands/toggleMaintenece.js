module.exports = {
  help: {
    perms: null,
    owner: true,
    server: false,
    name: "maintenence",
    desk: "Toggles the bot's Maintenence Mode"
  },
  command: {
    weight: 5,
    regex: /maintain|maintenence/gi,
    run: async (Bot, message, settings) => {
      await Bot.SetMaintenence(!Bot.UnderMaintenence);
      message.channel.send(`Toggled Maintenece to: **${Bot.UnderMaintenence}**`);
    }
  }
}
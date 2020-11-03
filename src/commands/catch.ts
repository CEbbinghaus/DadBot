import { command } from "../definitions";

export default {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "catch",
        desk: "makes the bot play Catch with you",
        category: "Fun"
    },
    command: {
        weight: 500,
        regex: /catch/gi,
        run: (bot, message, settings) => {
            message.reply(`\`\`\`CE                      .  o
            .
        .
 __O__/                                            _
/ /                                               _Y_ou
 /                                                (")/
\'\/\                                                (.)
  |                                              ( . )
(       \`   (    \`      (          \'       \`     )  (        \`    )\`\`\``);
        }
    }
} as command;
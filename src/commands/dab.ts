import { command } from "../definitions";

const images = [
    "https://s-media-cache-ak0.pinimg.com/originals/cc/f2/0e/ccf20e7aba60f7bcd7f2ba8838c65327.jpg",
    "https://d2g8igdw686xgo.cloudfront.net/20131494_1493864445.1698.jpg"
]
export default {
    help: {
        perms: null,
        owner: false,
        server: false,
        name: "dab",
        desk: "Makes Dad do a Dab",
        category: "Fun"
    },
    command: {
        weight: 500,
        regex: /dab/gi,
        run: (bot, message, settings) => {
            return message.channel.send(images[Math.random() * images.length | 0]);
        }
    }
} as command;
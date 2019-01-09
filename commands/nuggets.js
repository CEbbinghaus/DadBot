let urls = ["https://food.fnr.sndimg.com/content/dam/images/food/fullset/2013/9/12/1/FN_Picky-Eaters-Chicken-Nuggets_s4x3.jpg.rend.hgtvcom.826.620.suffix/1383770571120.jpeg"]
module.exports = {
  help: {
    perms: null,
    owner: false,
    server: false,
    name: "chicken nuggets",
    desk: "makes dad eat chicken nugges with you",
    category: "Fun"
  },
  command: {
    weight: 500,
    regex: /chicken\s*nuggets/gi,
    run: (bot, message, settings) => {
      message.channel.send(urls[Math.random() * urls.length | 0]);
    }
  }
}
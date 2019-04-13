const fetch = require("snekfetch");
let regx = /(cook|make\s*me)\s*(.+)/gi;
module.exports = {
  help: {
    perms: null,
    owner: false,
    server: false,
    name: "cook",
    desk: "cook's a dish for you",
    category: "Fun"
  },
  command: {
    weight: 500,
    regex: regx,
    run: async function(bot, message, settings){
      let dish = /(cook|make\s*me)\s*(.+)/gi.exec(message.content);
      if(!dish)return;
      let burnt = (Math.random() * 100 | 0) <= 25;
      let query = ((burnt ? "Burnt " : "") + dish[2]);
      console.log(query);
      fetch.get("https://api.qwant.com/api/search/images/", {
        qs: {
          'count': 50,
          'q': "Testing Something",
          't': 'images',
          'safesearch': 1,
          'locale': 'en_US',
          'uiv': 4
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
        }
      }).then(v => {
        if(v.ok){
          console.log(v.body);
        }
      })
    }
  }
}
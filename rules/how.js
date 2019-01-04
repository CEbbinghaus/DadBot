const fetch = require("snekfetch");
const {JSDOM, ResourceLoader} = require("jsdom");
module.exports = {
  name: "how do i",
  desk: "Gives you a Wikihow Article helping you out immensly",
  setting: "HOWDOI",
  regex: /how\s*do\s*i\s*(.+)/ig,
  execute: async function (Bot, message, match) {
    let query = await fetch.get("https://www.wikihow.com/wikiHowTo?search=" + match[0].split(" ").join(" "));
    let body = new JSDOM(query.text).window.document.body
    let results = Array.from(body.querySelector("#searchresults_list").children).map(v => v.href).filter(v => v ? true : false);
    if(results.length)
    message.channel.send(`Here. i found something that might help you: http:${results[0]}`);
  }
}
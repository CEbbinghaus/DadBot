const c = require("child_process");
c.exec("pm2 start . --name='DadBot'", (e, out, err) => {
    process.exit(0)
    console.log("started DadBot with pm2", out, err);
})
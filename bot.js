const token = process.env.token

// Custom log prefix
const moment = require("moment");
moment.locale("tr");
var log = console.log;
console.log = function () {
    args = [];
    args.push(`[${process.env.name}]`)
    args.push(`[${moment().utcOffset(3).format("lll")}]`)
    for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    log.apply(console, args);
};
// Set path prefix
process.env.path_prefix = process.env.PWD.replace("/app", "");
// Loading logs
log("\n ".repeat(12))
console.log("Bot açılıyor... || Dizin: " + process.env.PWD)


const http = require("http")
const express = require("express");
const app = express();
app.get("/", (request, response) => {
    console.log(`¨`);
    response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 10000);



// Load modules
const Discord = require("discord.js");
const fs = require("fs");
const db = require("quick.db");

// Create new client
const client = new Discord.Client();

// Load settings
client.settings = require("./ayarlar");
client.ayarlar = require("./ayarlar");


// Load events
require("./util/eventLoader")(client);

// Status
const activities_list = [
    "•••••••••••AKTİF•••••••••••",
    "••••••••BEKLEMEDE••••••••",
];
client.on("ready", () => {
    client.lastAvatarURL = "";
    client.setAvatar = function (url) {
        client.lastAvatarURL = url;
    }
    client.changeAvatar = () => {
        let currentAvatarURL = client.user.displayAvatarURL();
        let currentAvatarID = currentAvatarURL.split("/")[currentAvatarURL.split("/").length - 1].split(".")[0];

        if ((client.lastAvatarURL == process.env.path_prefix + "/app/assets/on.png" && currentAvatarID != "20fdbb3f72299197fa7f6879f2e4b590") || (client.lastAvatarURL == process.env.path_prefix + "/app/assets/off.png" && currentAvatarID != "fce8cae01305cbb91b3cce5f81a1e855"))
            client.user.setAvatar(client.lastAvatarURL)
                .then(user => console.log(`[AVATAR] Değiştirildi!`))
                .catch(err => console.error(`[AVATAR] Değiştirilemedi! (${err.message})`));
    }
    setTimeout(() => {
        setInterval(() => {
            if (client.user.presence.status == "dnd") {
                let activityInt = 0;
                if (!client.user.presence.activities[0] || !client.user.presence.activities[0].name || client.user.presence.activities[0].name != activities_list[activityInt]) {
                    client.user.setActivity(activities_list[activityInt])
                        .then(presence => console.log("[ACTIVITY]", presence.activities[0].name))
                        .catch(err => console.error)
                    client.clearInterval(client.changeAvatarInt)
                    client.changeAvatarInt = setInterval(() => client.changeAvatar(), 3000);
                }
                client.setAvatar(process.env.path_prefix + "/app/assets/on.png")
            } else {//if (client.user.presence.status == "idle") {
                let activityInt = 1;
                if (!client.user.presence.activities[0] || !client.user.presence.activities[0].name || client.user.presence.activities[0].name != activities_list[activityInt]) {
                    client.user.setActivity(activities_list[activityInt])
                        .then(presence => console.log("[ACTIVITY]", presence.activities[0].name))
                        .catch(err => console.error)
                    client.clearInterval(client.changeAvatarInt)
                    client.changeAvatarInt = setInterval(() => client.changeAvatar(), 3000);
                }
                client.setAvatar(process.env.path_prefix + "/app/assets/off.png")
            }
        }, ~~(100 + (Math.random() * 2000)));
    }, ~~(6000 + (Math.random() * 1000)))
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

getCommands(__dirname + "/komutlar/");
function getCommands(path) {
    fs.readdir(path, (err, files) => {
        if (err) console.error(err);
        files.forEach(f => {
            if (!f.endsWith(".js")) {
                // klasör ya da komut değil
                if (fs.lstatSync(path + f + "/").isDirectory()) {
                    // iç içe fonksiyonla tüm alt klasörlerdeki komutları tarıyoruz.
                    getCommands(path + f + "/");
                }
            } else {
                //komut.js
                let props = require(`${path}${f}`);
                client.commands.set(props.help.name, props);
                props.conf.aliases.forEach(alias => {
                    client.aliases.set(alias, props.help.name);
                });
            }
        });
    });
};

client.on("error", e => {
    console.log("[CLIENT.ERROR]", e);
    process.exit();
});

client.on("disconnect", e => {
    console.log("[DISCONNECT] id:" + client.id);
});

client.login(token);

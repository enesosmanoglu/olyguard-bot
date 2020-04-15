console.log("\n ".repeat(12))
console.log("~".repeat(50))
console.log(process.env.PROJECT_DOMAIN + " başlatılıyor. Lütfen bekleyiniz...")
console.log("~".repeat(50))


const express = require("express");
const app = express();
const http = require("http");
app.get("/", (request, response) => {
  console.log(`¨`);
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 10000);

//////////////////////////////////////////////////////////////////////

/* Modüller */
const Discord = require("discord.js");
const fs = require("fs");
const db = require("quick.db");
const moment = require("moment");
const log = console.log;
/*
console.log = function() {
  let args = Array.from(arguments);
  log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${args.join("\n")}`);
};
*/
const backup = require("discord-backup");
backup.setStorageFolder(__dirname + "/backups/");

const client = new Discord.Client();
client.ayarlar = require("./ayarlar");
const eventLoader = require("./util/eventLoader")(client);

const activities_list = ["•••••••••••AKTİF•••••••••••", "••••••••BEKLEMEDE••••••••"];

client.on("ready", () => {
  const setStatus = require("./util/setStatus")(client);
  const setDefaults = require("./util/setDefaults")(client);
  const dbSync = require("./util/dbSync")(client);
  console.log(`Aktif, ${client.commands.size} komut yüklendi!`);
  console.log(`${client.user.tag} giriş yaptı.`);

  /*
  let i = 0;
  setInterval(() => {
    client.user.setActivity(activities_list[i]);
    if (i == activities_list.length - 1) i = 0;
    else i++;
  }, 5000);
  */

  client.lastAvatarURL = "";
  client.setAvatar = function (url) {
    //console.log("setAvatar: " + url)
    client.lastAvatarURL = url;
  }
  client.changeAvatar = () => {
    let currentAvatarURL = client.user.displayAvatarURL();
    let currentAvatarID = currentAvatarURL.split("/")[currentAvatarURL.split("/").length - 1].split(".")[0];
    //console.log(currentAvatarID, client.lastAvatarURL)

    if ((client.lastAvatarURL == "/app/assets/on.png" && currentAvatarID != "20fdbb3f72299197fa7f6879f2e4b590") || (client.lastAvatarURL == "/app/assets/off.png" && currentAvatarID != "fce8cae01305cbb91b3cce5f81a1e855"))
      client.user.setAvatar(client.lastAvatarURL)
        .then(user => { console.log(`Avatar değiştirildi!`) })
        .catch(err => console.error(`Avatar değiştirilemedi! (${err.message})`));

    // if (db.get("lastAvatarURL") != client.lastAvatarURL) {
    //   console.log("Avatar değiştiriliyor.")
    //   let interval = setInterval(() => {
    //     client.user.setAvatar(client.lastAvatarURL)
    //       .then(async user => {
    //         clearInterval(interval)
    //         await db.set("lastAvatarURL", client.lastAvatarURL);
    //         await console.log(`Avatar değiştirildi!`)
    //       })
    //       .catch(err => console.error(`Avatar değiştirilemedi! (${err.message})`));
    //   }, 5000);
    // }
  }
  // setInterval(() => {
  //   changeAvatar()
  // }, 5000);
  setInterval(() => {
    if (client.user.presence.status == "dnd") {
      let activityInt = 0;
      if (!client.user.presence.activities[0] || !client.user.presence.activities[0].name || client.user.presence.activities[0].name != activities_list[activityInt]) {
        client.user.setActivity(activities_list[activityInt]);
        client.clearInterval(client.changeAvatarInt)
        client.changeAvatarInt = setInterval(() => client.changeAvatar(), 3000);
      }
      client.setAvatar("/app/assets/on.png")
    } else if (client.user.presence.status == "idle") {
      let activityInt = 1;
      if (!client.user.presence.activities[0] || !client.user.presence.activities[0].name || client.user.presence.activities[0].name != activities_list[activityInt]) {
        client.user.setActivity(activities_list[activityInt]);
        client.clearInterval(client.changeAvatarInt)
        client.changeAvatarInt = setInterval(() => client.changeAvatar(), 3000);
      }
      client.setAvatar("/app/assets/off.png")
    }
  }, 500);
});



client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

let komutlar = [];
let getCommands = function (path) {
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
        //console.log(path + f) // Her komutun yolunu ayrı ayrı loglar
        //komut.js
        let props = require(`${path}${f}`);
        komutlar.push(props.help.name);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.help.name);
        });
      }
    });
  });
};

getCommands("./komutlar/");

client.on("error", e => client.destroy());


var hataKontrol = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on("disconnect", e => {
  console.log("[Botun bağlantısı kaybedildi! id:" + client.id);
});

client.login(process.env.token);

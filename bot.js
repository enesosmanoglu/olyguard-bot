const express = require("express");
const app = express();
const http = require("http");
app.get("/", (request, response) => {
  //console.log(`¨`);
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
  setInterval(() => {
    if (client.user.presence.status == "dnd") {
      client.user.setActivity(activities_list[0]);
      client.setAvatar("/app/assets/on.png")
    }
    else if (client.user.presence.status == "idle") {
      client.user.setActivity(activities_list[1]);
      client.setAvatar("/app/assets/off.png")
    }
  }, 1000);
});

client.lastAvatarURL = "";
client.setAvatar = function (url) {
  client.lastAvatarURL = url;
}

let changeAvatar = setInterval(() => {
  if (db.get("lastAvatarURL") != client.lastAvatarURL) {
    db.set("lastAvatarURL", client.lastAvatarURL);
    console.log("Avatar değiştiriliyor.")
    client.user.setAvatar(client.lastAvatarURL)
      .then(user => console.log(`Avatar değiştirildi!`))
      .catch(err => console.error(`Avatar değiştirilemedi! (${err.message})`));
  }
}, 5000);

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

client.on("guildMemberAdd", member => {
  if (!db.get("botengel_" + member.guild.id)) return;

  const guild = member.guild;

  let sChannel = member.guild.channels.cache.find(c => c.name === "bot-engel");

  if (member.user.bot !== true) {
  } else {
    sChannel
      .send(
        `**OLYMPOS BOT ENGEL**
Sunucuya bot eklendi ve güvenlik nedeniyle banlandı: **${member.user.tag}**
@everyone`
      )
      .then(() => console.log(`yasaklandı ${member.displayName}`))
      .catch(console.error);
    member.ban(member);
  }
});

var hataKontrol = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on("disconnect", e => {
  console.log("[Botun bağlantısı kaybedildi! id:" + client.id);
});

client.login(process.env.token);

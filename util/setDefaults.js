const db = require("quick.db");
const fs = require("fs");

module.exports = client => {
  let path = process.env.path_prefix + "/app/komutlar/db/";

  fs.readdir(path, (err, files) => {
    if (err) console.error(err)

    files.forEach(file => {
      if (!file.endsWith(".js")) {
        fs.readdir(path + file + "/", (err, files2) => {
          if (err) return;

          files2.forEach(file2 => {
            if (!file2.endsWith(".js")) {
              return;
            } else {
              let fileName = file2.replace(path, "").replace(".js", "");
              client.guilds.cache.forEach(guild => {
                if (!db.has(`${fileName}_${guild.id}`)) {
                  db.set(`${fileName}_${guild.id}`, client.settings.default[fileName] ? client.settings.default[fileName] : 0)
                  console.log(`[DB] [SET] ${fileName}_${guild.id} = ${client.settings.default[fileName] ? client.settings.default[fileName] : 0}`)
                }
              })
            }

          })
        })
      } else {
        let fileName = file.replace(path, "").replace(".js", "");

        client.guilds.cache.forEach(guild => {
          if (!db.has(`${fileName}_${guild.id}`)) {
            db.set(`${fileName}_${guild.id}`, client.settings.default[fileName] ? client.settings.default[fileName] : 0)
            console.log(`[DB] [SET] ${fileName}_${guild.id} = ${client.settings.default[fileName] ? client.settings.default[fileName] : 0}`)
          }
        })
      }

    })
  })



};
module.exports = client => {
  client.guild = client.guilds.cache.find(g => g.id == client.settings.sunucu);

  let olyguards = [];

  setTimeout(() => {
    setInterval(() => {
      if (olyguards.length != client.settings.olyguard_ids.length - 1) {
        client.settings.olyguard_ids.forEach(id => {
          if (id == client.user.id) return;
          if (!client.guild) return console.error(`[setStatus.js] [ERROR] [GUILD] Ana sunucu bulunamadı. (ayarlar.sunucu = ${client.settings.sunucu})`);
          let og = client.guild.members.cache.find(m => m.id == id);
          if (!og) return console.error("[ERROR] [OG_OTHER] Diğer koruma botu bulunamadı. ID: " + id);
          olyguards.push(og);
        });
      }

      let canIwork = true;
      for (let i = 0; i < olyguards.length; i++) {
        const og = olyguards[i];
        let status = og.user.presence.status;
        if (status == "dnd") canIwork = false;
      }

      if (canIwork) {
        if (client.user.presence.status != "dnd") {
          client.user.setStatus("dnd")
          console.log("[STATUS] Aktif!")
          client.clearInterval(client.changeAvatarInt)
          client.changeAvatarInt = setInterval(() => client.changeAvatar(), 3000);
        };
      } else {
        if (client.user.presence.status != "idle") {
          client.user.setStatus("idle")
          console.log("[STATUS] Beklemede...")
          client.clearInterval(client.changeAvatarInt)
          client.changeAvatarInt = setInterval(() => client.changeAvatar(), 3000);
        };
      }

    }, ~~(100 + (Math.random() * 2000)));
  }, ~~(5000 + (Math.random() * 1000)));

};

module.exports = client => {
  client.guild = client.guilds.cache.find(g => g.id == client.ayarlar.sunucu);
  client.user.setAvatar("/app/assets/on.png");

  let olyguards = [];

  setInterval(() => {
    if (olyguards.length != client.ayarlar.olyguard_ids.length - 1) {
      client.ayarlar.olyguard_ids.forEach(id => {
        if (id == client.user.id) return;

        if (!client.guild) return console.error("Ana sunucu bulunamadı. Bekleniyor... (ayarlar.sunucu)");

        let og = client.guild.members.cache.find(m => m.id == id);
        if (!og) return console.error("bot kicklenmiş: " + id);
        olyguards.push(og);
      });
    }

    let canIwork = true;
    for (let i = 0; i < olyguards.length; i++) {
      const og = olyguards[i];
      let status = og.user.presence.status;
      //console.log(i, status);

      if (status == "dnd") canIwork = false;
    }

    if (canIwork) {
      if (client.user.presence.status != "dnd") {
        client.user.setStatus("dnd")
        console.log("aktif")
        client.clearInterval(client.changeAvatarInt)
        client.changeAvatarInt = setInterval(() => client.changeAvatar(), 3000);
      };
    }
    else {
      if (client.user.presence.status != "idle") {
        client.user.setStatus("idle")
        console.log("beklemede")
        client.clearInterval(client.changeAvatarInt)
        client.changeAvatarInt = setInterval(() => client.changeAvatar(), 3000);
      };
    }

  }, 1000);
};

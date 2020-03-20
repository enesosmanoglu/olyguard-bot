const Discord = require("discord.js");
const db = require("quick.db");

module.exports = member => {
  const client = member.client;
  const ayarlar = client.ayarlar;

  if (ayarlar.olyguard_ids.some(id => id == member.id)) {
    // Olyguard botu giriş yaptı.
    return (client.olyguards = []);
  }

  // BOT ENGEL
  if (
    !(db.has("botengel_" + member.guild.id)
      ? !db.get("botengel_" + member.guild.id)
      : !ayarlar.default.botengel) &&
    member.user.bot
  ) {
    const guild = member.guild;

    let sChannel = member.guild.channels.cache.find(
      c => c.name === "bot-engel"
    );
    if (!sChannel) {
      sChannel = member.guild.channels.cache.first();
    }
    if (!sChannel) {
      return console.log("Kanalsız sunucuya da bot girsin bi zahmet..");
    }

    member
      .ban(member)
      .then(() => {
        sChannel
          .send(
            `**OLYMPOS BOT ENGEL**
Sunucuya bot eklendi ve güvenlik nedeniyle banlandı: **${member.user.tag}**
@everyone`
          )
          .then(() => console.log(`yasaklandı ${member.displayName}`))
          .catch(console.error);
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  if (client.user.presence.status != "dnd") return; // Buranın altını sadece aktif bot yükler.
};

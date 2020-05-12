const Discord = require("discord.js");
const db = require("quick.db");

module.exports = guild => {
  const client = guild.client;
  const ayarlar = client.settings;

  if (guild.id == ayarlar.sunucu) {
    client.guild = guild;
  }

  if (client.user.presence.status != "dnd") return; // Buranın altını sadece aktif bot yükler.
};
 
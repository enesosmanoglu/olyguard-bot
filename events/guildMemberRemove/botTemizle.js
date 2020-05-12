const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment");

module.exports = async member => {
  const client = member.client;
  const ayarlar = client.settings;

  if (ayarlar.olyguard_ids.some(id => id == member.id)) {
    // Guard Botlardan biri sunucudan ayrıldı ya da atıldı.
    client.olyguards = [];
  }
};
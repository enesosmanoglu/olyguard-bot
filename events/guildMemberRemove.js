const Discord = require("discord.js");
const db = require("quick.db");

module.exports = member => {
  const client = member.client;
  const ayarlar = client.ayarlar;
  
  if (ayarlar.olyguard_ids.some(id => id == member.id)) {
    // Bot sunucudan ayrıldı.
    //client.olyguards = client.olyguards.filter(og => og.id != member.id)
    client.olyguards = [];
  }
  
  if (client.user.presence.status != "dnd") return;
  
   
};
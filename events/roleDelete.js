const Discord = require("discord.js");
const db = require("quick.db");

module.exports = role => {
  const client = role.client;
  const ayarlar = client.ayarlar;
  
  if (client.user.presence.status != "dnd") return;
  
  let rolKorumaAktiflik = db.has("rolkoruma_" + role.guild.id) ? db.get("rolkoruma_" + role.guild.id) : ayarlar.default.rolkoruma;
  
  if (!rolKorumaAktiflik) return; 
  
    let mention = role.mentionable;
    let hoist = role.hoist;
    let color = role.hexColor;
    let name = role.name;
    let perms = role.permissions;
    let position = role.position;
    role.guild.roles.create({
        name: name,
        color: color,
        hoist: hoist,
        position: position,
        permissions: perms,
        mentionable: mention
    });
};
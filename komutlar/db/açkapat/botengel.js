const Discord = require('discord.js');
const db = require('quick.db');
const komutAdı = __filename.replace(__dirname,"").replace("/","").replace(".js","");
const ayarlar = require("/app/ayarlar");

exports.run = async (client, message, args) => {

    let durum = true;
    if (args[0] == "aç")
      durum = true
    else if (args[0] == "kapat")
      durum = false
    else if (args.length == 0)
      return message.channel.send(new Discord.MessageEmbed().setTitle(komutAdı.toUpperCase()).setDescription(db.get(`${komutAdı}_${message.guild.id}`)?"açık":"kapalı")).then(msg=>msg.delete({ timeout: 10000 }))
    else
      return message.channel.send(new Discord.MessageEmbed().setTitle(komutAdı.toUpperCase()).addField("Özellik Aç",ayarlar.prefix + komutAdı + " aç").addField("Özellik Kapat",ayarlar.prefix + komutAdı + " kapat")).then(msg=>msg.delete({ timeout: 10000 }))
    
    db.set(`${komutAdı}_${message.guild.id}`,durum)
    message.channel.send(new Discord.MessageEmbed().setTitle(komutAdı.toUpperCase()).setDescription(durum?"açıldı":"kapatıldı"))

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.üst // => Yetkisiz komut: @everyone
};

exports.help = {
    name: komutAdı,
    description: `${komutAdı} özelliğini aç/kapat`,
    usage: `${komutAdı}`
};
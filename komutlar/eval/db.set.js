const Discord = require('discord.js');
const db = require('quick.db');
const komutAdı = __filename.replace(__dirname,"").replace("/","").replace(".js","")
const ayarlar = require("/app/ayarlar");

const anaKomut = komutAdı.split(".")[0];
const ozellik = komutAdı.split(".")[1];

exports.run = async (client, message, args) => {

  let komut = message.content.replace(ayarlar.prefix,"").replace(komutAdı + " ",komutAdı)
    
  eval(komut)

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ayarlar.perms.üst // => Yetkisiz komut: @everyone
};

exports.help = {
    name: komutAdı,
    description: `${anaKomut} için ${ozellik} işlemi`,
    usage: `${komutAdı}`
};
const Discord = require('discord.js');
const db = require('quick.db');
const komutAdı = __filename.replace(__dirname,"").replace("/","").replace(".js","")

const anaKomut = komutAdı.split(".")[0];
const ozellik = komutAdı.split(".")[1];

exports.run = async (client, message, args) => {
    const ayarlar = client.ayarlar;

    

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ["Zeus", "Athena"] // => Yetkisiz komut: @everyone
};

exports.help = {
    name: komutAdı,
    description: `${anaKomut} için ${ozellik} işlemi`,
    usage: `${komutAdı}`
};
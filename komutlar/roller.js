const Discord = require('discord.js');
const db = require('quick.db');
const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")
const ayarlar = require(process.env.path_prefix + "/app/ayarlar");

exports.run = async (client, message = new Discord.Message(), args) => {
    message.react("✅")

    let rolesArray = message.guild.roles.cache.sort((a, b) => a.position - b.position).array();
    let roles = rolesArray.slice(rolesArray.indexOf(rolesArray.find(r => r.name == "Dionysos")))

    //message.channel.send(`${message.guild.roles.cache.sort((a, b) => a.position - b.position).array().join("\n")}`)
    message.channel.send(`${roles.join("\n")}`)
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["roles"],
    perms: ayarlar.perms.üst // => Yetkisiz komut: @everyone
};

exports.help = {
    name: komutAdı,
    description: ``,
    usage: `${komutAdı}`
};
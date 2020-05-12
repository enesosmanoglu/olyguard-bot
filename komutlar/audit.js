const Discord = require('discord.js');
const db = require('quick.db');
const komutAdı = __filename.replace(__dirname, "").replace("/", "").replace(".js", "")
const ayarlar = require(process.env.path_prefix + "/app/ayarlar");

exports.run = async (client, message, args) => {
    message.react("✅")

    message.guild.fetchAuditLogs()
        .then(audit => {
            let entries = []
            audit.entries.array().slice(0, 10).forEach(entry => {
                entries.push(`${entry.executor} > ${entry.action} > ${entry.target}`)
            });
            message.channel.send(entries.join("\n"))
        })
        .catch(console.error);

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["denetimkaydı"],
    perms: ayarlar.perms.üst // => Yetkisiz komut: @everyone
};

exports.help = {
    name: komutAdı,
    description: ``,
    usage: `${komutAdı}`
};
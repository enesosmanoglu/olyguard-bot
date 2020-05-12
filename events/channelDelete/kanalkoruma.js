const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment");

module.exports = async (channel = new Discord.Channel()) => {
    const client = channel.client;
    const ayarlar = client.settings;
    const guild = channel.guild;

    // KANAL SİLME ENGELİ
    if (db.get("kanalkoruma_" + channel.guild.id) && (client.user.presence.status == "dnd")) {
        if (channel.type == "voice") {
            channel.clone({ channel, bitrate: channel.bitrate }).then(ch => {
                ch.edit({ position: channel.position })
            });
        }
        if (channel.type == "text") {
            channel.clone({ channel }).then(ch => {
                ch.edit({ position: channel.position })
                if (ch.send)
                    ch.send(
                        new Discord.MessageEmbed()
                            .setColor(ayarlar.color)
                            .setTitle("Kanal Koruması")
                            .setDescription("Kanal başarıyla geri yüklendi.")
                    );
            });
        }
        if (channel.type == "category") {
            channel.clone({ channel }).then(async ch => {
                await ch.edit({ position: channel.position })
            });
        }
    }

};
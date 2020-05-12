const Discord = require("discord.js");
const db = require("quick.db");

module.exports = async (message = new Discord.Message()) => {
    if (!message.client.settings.default["raid.kanallar"].some(kanal => kanal == message.channel.name)) return;
    if (message.channel.type != "text") return; 
    if (message.author.bot) return;
    if (!db.get(`raid_${message.guild.id}`)) return;

    const client = message.client;

    let authors = [message.author.id]
    // RAID
    const filter = m => m.content == message.content && !authors.some(a => a == m.author.id); // => Farklı hesap kodu
    const collector = message.channel.createMessageCollector(filter, {
        time: db.get(`raid.saniye_${message.guild.id}`) * 1000,
        max: db.get(`raid.kişi_${message.guild.id}`) - 1, // - 1 yapma sebebi ilk atılan mesaj toplayıcı başlatıyor kendini saymıyor
    });

    collector.id = message.id;
    if (!client.raidCollectors)
        client.raidCollectors = {};
    client.raidCollectors[collector.id] = collector;

    collector.i = Object.keys(client.raidCollectors).indexOf(collector.id)

    collector.count = 1;

    collector.on("collect", m => {
        authors.push(m.author.id)
        console.log(`[RAID #${collector.i}] [${++collector.count}] [${m.author.tag}]: ${m.content}`);
        collector.checkEnd();
    });
    collector.on("end", async collected => {
        delete client.raidCollectors[collector.id];

        if (collected.size >= collector.options.max) {
            console.log(`[RAID #${collector.i}] [KANAL KAPATILDI] [${message.channel.name}] Raid Mesajı: ${message.content}`);
            Object.values(client.raidCollectors).forEach(otherCollector => {
                if (otherCollector.id == collector.id) return;
                otherCollector.collected.clear();
                otherCollector.stop("Raid saptandı.");
            });

            if (client.user.presence.status == "dnd") {
                let roles = {
                    taglı: message.guild.roles.cache.find(r => r.name == "Elite of Olympos"),
                    tagsız: message.guild.roles.cache.find(r => r.name == "Rebel of Olympos"),
                    kayıtsız: message.guild.roles.cache.find(r => r.name == "Peasant of Olympos"),
                    herkes: message.guild.roles.everyone,
                }
                Object.values(roles).forEach(async role => {
                    await message.channel.updateOverwrite(role, { SEND_MESSAGES: false })
                });
                let Zeus = message.guild.roles.cache.find(r => r.name == "Zeus");
                let Poseidon = message.guild.roles.cache.find(r => r.name == "Poseidon");
                await message.channel.send((Zeus ? Zeus : `<@${client.settings.yetkili_ids[0]}>`) + " " + (Poseidon ? Poseidon : `<@${client.settings.yetkili_ids[1]}>`), client.embed().setDescription(`Spam koruması nedeniyle kanal mesajlara kapatıldı!`).setColor("RED"))
            }
        }
    });

}
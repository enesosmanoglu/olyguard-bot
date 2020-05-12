const Discord = require("discord.js");
const db = require("quick.db");
const olymposAyarlar = require("/app/ayarlar")

module.exports = async (message = new Discord.Message()) => {
    const client = message.client;

    if (message.channel.type != "text") return;
    if (message.author.bot) return;
    if (!message.member) return;  
    if (message.member.roles.cache.some(r => olymposAyarlar.perms.vipüstü.some(y => y == r.name))) return; // vip üstüne spam işlemesin
    if (!db.get(`spam_${message.guild.id}`)) return;


    // SPAM 
    const filter = m => m.content == message.content && m.author.id == message.author.id; // => Aynı hesap kodu
    const collector = message.channel.createMessageCollector(filter, {
        time: db.get(`spam.saniye_${message.guild.id}`) * 1000,
        max: db.get(`spam.tekrar_${message.guild.id}`) - 1, // - 1 yapma sebebi: ilk atılan mesaj, toplayıcıyı başlatıyor yani kendini saymıyor.
    });

    collector.id = message.id;
    if (!client.spamCollectors)
        client.spamCollectors = {};
    client.spamCollectors[collector.id] = collector;

    collector.i = Object.keys(client.spamCollectors).indexOf(collector.id)

    collector.count = 1;

    collector.on("collect", m => {
        console.log(`[SPAM #${collector.i}] [${++collector.count}. UYARI] [${message.channel.name}] [${m.author.tag}]: ${m.content}`);
        collector.checkEnd();
    });
    collector.on("end", async collected => {
        delete client.spamCollectors[collector.id];
        if (collected.size >= collector.options.max) {
            // YETERİ KADAR SPAM MESAJI BULUNDU
            console.log(`[SPAM #${collector.i}] [CEZA] [${message.channel.name}] [${message.author.tag}]: ${message.content}`);
            Object.values(client.spamCollectors).forEach(otherCollector => {
                if (otherCollector.id == collector.id) return;
                otherCollector.collected.clear();
                otherCollector.stop("Spam saptandı.");
            });

            db.add(`${message.author.id}.spam.uyarı`, 1);

            const currentUyarı = db.has(`${message.author.id}.spam.uyarı`) ? db.get(`${message.author.id}.spam.uyarı`) : 1;
            const maxUyarı = db.get(`spam.uyarı_${message.guild.id}`);

            if (client.user.presence.status == "dnd") { // BOT AKTİFSE YAP
                message.delete()
                    .then(async () => {
                        collected.each(msg => msg.delete());
                        if (currentUyarı != maxUyarı)
                            message.reply(client.embed().setTitle(`Lütfen spam yapmayınız!`).setDescription(`Uyarı sayısı: **${currentUyarı}**/**${maxUyarı}**`));
                    });
            }

            if (currentUyarı >= maxUyarı) {
                // SPAM UYARI LİMİTİ AŞILMIŞ CEZA VAKTİ
                if (client.user.presence.status != "dnd")
                    return db.delete(`${message.author.id}.spam.uyarı`);

                message.reply(client.embed().setTitle(`Lütfen spam yapmayınız!`).setDescription(`Uyarı sınırına ulaştığınız için **10 dakika mute** cezası yediniz!`));

                let botlarArası = message.guild.channels.cache.find(c => c.name == client.settings.olympos.channelName)
                if (!botlarArası) {
                    botlarArası = client.users.cache.find(u => u.id == client.settings.yetkili_ids[0])
                }
                if (!botlarArası) {
                    console.log("BOTLAR ARASI KANALINI BULAMADIM :(\nSpam cezası kesilemedi. (Spam yapan kullanıcı id'si: " + message.author.id + ")");
                }

                botlarArası.send(`${client.settings.olympos.prefix}${client.settings.olympos.commands.mute} <@${message.author.id}> 10 [olyguard] [SPAM] Spam mesajı: **${message.content}**`)
                    .catch(err => {
                        console.error(err, "BOTLAR ARASI KANALINA MESAJ GÖNDEREMEDİM :(\nSpam cezası kesilemedi. (Spam yapan kullanıcı id'si: " + message.author.id + ")");
                    })
                    .then(() => {
                        db.delete(`${message.author.id}.spam.uyarı`);
                    });
            }
        }
    });


}
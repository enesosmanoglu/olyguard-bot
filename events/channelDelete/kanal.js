const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment");

module.exports = async (channel = new Discord.Channel()) => {
    if (!db.get(`kanal_${channel.guild.id}`)) return;

    const client = channel.client;
    const ayarlar = client.settings;
    const guild = channel.guild;

    /* KANAL SİLME UYARI */
    let kanalDakika = db.get(`kanal.dakika_${guild.id}`);
    let kanalAdet = db.get(`kanal.adet_${guild.id}`);

    const denetimKaydı = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_DELETE',
    });
    const sonKayıt = denetimKaydı.entries.first();
    if (!sonKayıt) return console.log(`[CHANNEL] [DELETED] [${channel.name}] ~~ [NON-EXECUTOR] WTF?!?`);

    const { executor, target } = sonKayıt;
    let execMember = guild.member(executor);

    let now = parseInt(moment().utcOffset(3).format("x"))
    let currentLog = { timestamp: now, channel: channel };

    let logCounts = 0;
    // 
    let minus = []
    db.push(`${guild.id}${executor.id}.channel.log`, currentLog).channel.log.forEach(log => {
        let mom = log.timestamp + (kanalDakika * 60 * 1000)
        let kanal = log.channel

        if (log.timestamp != now)
            minus.push(((log.timestamp - now) / 1000).toFixed())

        if (now <= mom) {
            // belirtilen süre içinde tekrar kayıt alındı.
            logCounts++
        }
    })

    let logs = []
    logs.push(`   `)
    logs.push(` > Kanal silen üye: "${execMember.displayName}" /*${executor.tag}*/ #${executor.id}`)
    logs.push(` > Sildiği kanal: "${channel.name}"`)
    logs.push(`   `)
    logs.push(` ! Önceki silme zamanı: ${Math.max(...minus) * -1} saniye önce`)
    logs.push(` ! Hızlı silme sayısı: ${logCounts}/${kanalAdet}`)
    logs.push(` ! Toplamda ${db.get(`${guild.id}${executor.id}.channel.log`).length} kanal silmiş.`)
    logs.push(`   `)

    logs.forEach(log => console.log(log))

    if (client.user.presence.status == "dnd") {
        let embed = new Discord.MessageEmbed()
            .setAuthor(execMember.displayName, executor.displayAvatarURL({ dynamic: true }))
            .setTitle("Bir kanalı sildi!")
            .addField("Silinen kanal:", `**${channel.name}**`, true)
            .addField("Önceki silme zamanı:", `**${Math.max(...minus) * -1}** saniye önce`)
            .addField("Hızlı silme sayısı:", `**${logCounts}**/**${kanalAdet}**`, true)
            .addField("Toplamda sildiği kanal:", `**${db.get(`${guild.id}${executor.id}.channel.log`).length}** adet`)
            .setColor(ayarlar.color)
            .setTimestamp()
        let bilgiCh = guild.channels.cache.find(c => c.name == "komutsuz-bilgi");
        if (bilgiCh) {
            if (!executor.bot)
                bilgiCh.send("@everyone", { embed: embed })
        }
    }

    if (logCounts >= kanalAdet) {
        // belirtilen süre içerisinde belirtilen sayıya ulaştı. Ceza vakti !!

        if (client.user.presence.status != "dnd") return;

        let rolesArray = guild.roles.cache.sort((a, b) => a.position - b.position).array();
        let roles = rolesArray.slice(rolesArray.indexOf(rolesArray.find(r => r.name == "Dionysos")))

        let oncekiRoller = [];
        execMember.roles.cache.filter(a => roles.some(r => r.name == a.name)).forEach(role => {
            oncekiRoller.push(role);
        });
        await execMember.roles.remove(oncekiRoller, "Çok fazla kanal silme cezası.");
        let oncekiRollerNames = []
        oncekiRoller.forEach(rol => {
            oncekiRollerNames.push(rol.name)
        })
        executor.send(`Kısa süre içerisinde çok fazla kanal sildiğiniz için rolleriniz alındı, rollerinizi geri almak için yetkililere başvurun.\n\n@Zeus & @Poseidon`)
        ayarlar.yetkili_ids.forEach(yetkiliID => {
            let yetkili = client.users.cache.find(u => u.id == yetkiliID);
            yetkili.send(new Discord.MessageEmbed().setDescription(`${executor} kullanıcısı çok fazla **kanal** sildiği için rolleri alındı!\n\nAlınan rolleri: **${oncekiRollerNames.join("** _|_ **")}**`))
        })

    }


};
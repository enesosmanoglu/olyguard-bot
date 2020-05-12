const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment");

module.exports = async (guild = new Discord.Guild(), user = new Discord.User()) => {
    if (!db.get(`ban_${guild.id}`)) return;

    const client = guild.client;
    const ayarlar = client.settings;

    /* ÜYE BAN UYARI */
    let member = guild.member(user);

    let banDakika = db.get(`ban.dakika_${guild.id}`);
    let banKişi = db.get(`ban.kişi_${guild.id}`);

    const denetimKaydı = await guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_BAN_ADD',
    });
    const sonKayıt = denetimKaydı.entries.first();
    if (!sonKayıt) return console.log(`[BANNED] [${user.id}] [${user.tag}] [${member.displayName}] ~~ [NON-EXECUTOR] WTF?!?`);

    const { executor, target, reason } = sonKayıt;
    let execMember = guild.member(executor);

    let now = parseInt(moment().utcOffset(3).format("x"))
    let currentLog = { timestamp: now, member: member };

    let logCounts = 0;
    // 
    let minus = []
    db.push(`${guild.id}${executor.id}.ban.log`, currentLog).ban.log.forEach(log => {
        let mom = log.timestamp + (banDakika * 60 * 1000)
        let mem = log.member

        if (log.timestamp != now)
            minus.push(((log.timestamp - now) / 1000).toFixed())

        if (now <= mom) {
            // belirtilen süre içinde tekrar kayıt alındı.
            logCounts++
        }
    })


    let logs = []
    logs.push(`   `)
    logs.push(` > Banlayan üye: "${execMember.displayName}" /*${executor.tag}*/ #${executor.id}`)
    logs.push(` > Banladığı üye: "${member.displayName}" /*${user.tag}*/ #${user.id}`)
    logs.push(` > Banlama sebebi: ${reason ? reason : "Sebep girilmemiş."}`)
    logs.push(`   `)
    logs.push(` ! Önceki ban zamanı: ${Math.max(...minus) * -1} saniye önce`)
    logs.push(` ! Hızlı banlama sayısı: ${logCounts}/${banKişi}`)
    logs.push(` ! Toplamda ${db.get(`${guild.id}${executor.id}.ban.log`).length} kişiyi banlamış.`)
    logs.push(`   `)

    logs.forEach(log => console.log(log))

    if (client.user.presence.status == "dnd") {
        let embed = new Discord.MessageEmbed()
            .setAuthor(execMember.displayName, executor.displayAvatarURL({ dynamic: true }))
            .setTitle("Bir üyeyi sunucudan banladı!")
            .addField("Banlayan üye:", `<@${executor.id}>`, true)
            .addField("Banlanan üye:", `<@${user.id}>`, true)
            .addField("Sebep:", `${reason ? reason : "Sebep girilmemiş."}`)
            .addField("Önceki ban zamanı:", `**${Math.max(...minus) * -1}** saniye önce`)
            .addField("Hızlı ban sayısı:", `**${logCounts}**/**${banKişi}**`, true)
            .addField("Toplamda banladığı kişi:", `**${db.get(`${guild.id}${executor.id}.ban.log`).length}** kişi`)
            .setColor(ayarlar.color)
            .setTimestamp()
        let bilgiCh = guild.channels.cache.find(c => c.name == "komutsuz-bilgi");
        if (bilgiCh) {
            if (!executor.bot)
                bilgiCh.send("@everyone", { embed: embed })
        }
    }

    if (logCounts >= banKişi) {
        // belirtilen süre içerisinde belirtilen sayıya ulaştı. Ceza vakti !!

        if (client.user.presence.status != "dnd") return;

        let rolesArray = guild.roles.cache.sort((a, b) => a.position - b.position).array();
        let roles = rolesArray.slice(rolesArray.indexOf(rolesArray.find(r => r.name == "Dionysos")))

        let oncekiRoller = [];
        execMember.roles.cache.filter(a => roles.some(r => r.name == a.name)).forEach(role => {
            oncekiRoller.push(role);
        });
        await execMember.roles.remove(oncekiRoller, "Çok fazla banlama cezası.");
        let oncekiRollerNames = []
        oncekiRoller.forEach(rol => {
            oncekiRollerNames.push(rol.name)
        })
        executor.send(`Kısa süre içerisinde çok fazla üye banladığınız için rolleriniz alındı, rollerinizi geri almak için yetkililere başvurun.\n\n@Zeus & @Poseidon`)
        ayarlar.yetkili_ids.forEach(yetkiliID => {
            let yetkili = client.users.cache.find(u => u.id == yetkiliID);
            yetkili.send(new Discord.MessageEmbed().setDescription(`${executor} kullanıcısı çok fazla üye **ban**ladığı için rolleri alındı!\n\nAlınan rolleri: **${oncekiRollerNames.join("** _|_ **")}**`))
        })

    }


};

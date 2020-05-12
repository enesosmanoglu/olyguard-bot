const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment");

module.exports = async (member = new Discord.GuildMember()) => {
    if (!db.get(`kick_${member.guild.id}`)) return;

    const client = member.client;
    const ayarlar = client.settings;

    /* ÜYE KİCK UYARI */
    let guild = member.guild;
    let user = member.user;

    try {
        let banInfo = await guild.fetchBan(user)
        if (banInfo) {
            console.log(`[BANNED] [${banInfo.user.id}] [${banInfo.user.tag}] ~~ [${banInfo.reason}] ~~ [NON-KICK]`);
            return;
        }
    } catch (error) {
        console.log("=LEFT USER NOT BANNED=")
    }

    let kickDakika = db.get(`kick.dakika_${guild.id}`);
    let kickKişi = db.get(`kick.kişi_${guild.id}`);

    const denetimKaydı = await guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_KICK',
    });
    const sonKayıt = denetimKaydı.entries.first();
    if (!sonKayıt) return console.log(`[LEFT] [${user.id}] [${user.tag}] [${member.displayName}] ~~ [NON-KICK]`);

    let now = parseInt(moment().utcOffset(3).format("x"))
    const { executor, target, reason, createdTimestamp } = sonKayıt;
    console.log(now - createdTimestamp)
    if (now - createdTimestamp > 2000) return console.log(`[LEFT] [${user.id}] [${user.tag}] [${member.displayName}] ~~ [NON-KICK]`);
    if (target.id != member.id) return;
    let execMember = guild.member(executor);

    //console.log(`[KICKED] ${member.displayName} (${user.tag}@${user.id}) ~~~~ [BY] ${execMember.displayName} (${executor.tag}@${executor.id})`);

    let currentLog = { timestamp: now, member: member };

    let logCounts = 0;
    // 
    let minus = []
    db.push(`${member.guild.id}${executor.id}.kick.log`, currentLog).kick.log.forEach(log => {
        let mom = log.timestamp + (kickDakika * 60 * 1000)
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
    logs.push(` > Kickleyen üye: "${execMember.displayName}" /*${executor.tag}*/ #${executor.id}`)
    logs.push(` > Kicklediği üye: "${member.displayName}" /*${user.tag}*/ #${user.id}`)
    logs.push(` > Kickleme sebebi: ${reason ? reason : "Sebep girilmemiş."}`)
    logs.push(`   `)
    logs.push(` ! Önceki kick zamanı: ${Math.max(...minus) * -1} saniye önce`)
    logs.push(` ! Hızlı kickleme sayısı: ${logCounts}/${kickKişi}`)
    logs.push(` ! Toplamda ${db.get(`${member.guild.id}${executor.id}.kick.log`).length} kişiyi kicklemiş.`)
    logs.push(`   `)

    logs.forEach(log => console.log(log))

    if (client.user.presence.status == "dnd") {
        let embed = new Discord.MessageEmbed()
            .setAuthor(execMember.displayName, executor.displayAvatarURL({ dynamic: true }))
            .setTitle("Bir üyeyi sunucudan kickledi!")
            .addField("Kickleyen üye:", `<@${executor.id}>`, true)
            .addField("Kicklenen üye:", `<@${user.id}>`, true)
            .addField("Sebep:", `${reason ? reason : "Sebep girilmemiş."}`)
            .addField("Önceki kick zamanı:", `**${Math.max(...minus) * -1}** saniye önce`)
            .addField("Hızlı kickleme sayısı:", `**${logCounts}**/**${kickKişi}**`, true)
            .addField("Toplamda kicklediği kişi:", `**${db.get(`${member.guild.id}${executor.id}.kick.log`).length}** kişi`, true)
            .setColor(ayarlar.color)
            .setTimestamp()
        let bilgiCh = guild.channels.cache.find(c => c.name == "komutsuz-bilgi");
        if (bilgiCh) {
            if (!executor.bot)
                bilgiCh.send("@everyone", { embed: embed })
        }
    }

    if (logCounts >= kickKişi) {
        // belirtilen süre içerisinde belirtilen sayıya ulaştı. Ceza vakti !!

        if (client.user.presence.status != "dnd") return;

        let rolesArray = guild.roles.cache.sort((a, b) => a.position - b.position).array();
        let roles = rolesArray.slice(rolesArray.indexOf(rolesArray.find(r => r.name == "Dionysos")))

        let oncekiRoller = [];
        execMember.roles.cache.filter(a => roles.some(r => r.name == a.name)).forEach(role => {
            oncekiRoller.push(role);
        });
        await execMember.roles.remove(oncekiRoller, "Çok fazla kickleme cezası.");
        let oncekiRollerNames = []
        oncekiRoller.forEach(rol => {
            oncekiRollerNames.push(rol.name)
        })
        executor.send(`Kısa süre içerisinde çok fazla üye kicklediğiniz için rolleriniz alındı, rollerinizi geri almak için yetkililere başvurun.\n\n@Zeus & @Poseidon`)
        ayarlar.yetkili_ids.forEach(yetkiliID => {
            let yetkili = client.users.cache.find(u => u.id == yetkiliID);
            yetkili.send(new Discord.MessageEmbed().setDescription(`${executor} kullanıcısı çok fazla üye **kick**lediği için rolleri alındı!\n\nAlınan rolleri: **${oncekiRollerNames.join("** _|_ **")}**`))
        })

    }




};
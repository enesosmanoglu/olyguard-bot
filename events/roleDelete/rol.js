const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment");

module.exports = async (role = new Discord.Role()) => {
    if (!db.get(`rol_${role.guild.id}`)) return

    const client = role.client;
    const ayarlar = client.settings;
    const guild = role.guild;

    /* ROL SİLME UYARI */
    let rolDakika = db.get(`rol.dakika_${guild.id}`);
    let rolAdet = db.get(`rol.adet_${guild.id}`);

    const denetimKaydı = await guild.fetchAuditLogs({
        limit: 1,
        type: 'ROLE_DELETE',
    });
    const sonKayıt = denetimKaydı.entries.first();
    if (!sonKayıt) return console.log(`[ROLE] [DELETED] [${role.name}] ~~ [NON-EXECUTOR] WTF?!?`);

    const { executor, target } = sonKayıt;
    let execMember = guild.member(executor);

    let now = parseInt(moment().utcOffset(3).format("x"))
    let currentLog = { timestamp: now, role: role };

    let logCounts = 0;
    // 
    let minus = []
    db.push(`${guild.id}${executor.id}.role.log`, currentLog).role.log.forEach(log => {
        let mom = log.timestamp + (rolDakika * 60 * 1000)
        let rol = log.role

        if (log.timestamp != now)
            minus.push(((log.timestamp - now) / 1000).toFixed())

        if (now <= mom) {
            // belirtilen süre içinde tekrar kayıt alındı.
            logCounts++
        }
    })

    let logs = []
    logs.push(`   `)
    logs.push(` > Rol silen üye: "${execMember.displayName}" /*${executor.tag}*/ #${executor.id}`)
    logs.push(` > Sildiği rol: "${role.name}"`)
    logs.push(`   `)
    logs.push(` ! Önceki silme zamanı: ${Math.max(...minus) * -1} saniye önce`)
    logs.push(` ! Hızlı silme sayısı: ${logCounts}/${rolAdet}`)
    logs.push(` ! Toplamda ${db.get(`${guild.id}${executor.id}.role.log`).length} rol silmiş.`)
    logs.push(`   `)

    logs.forEach(log => console.log(log))

    if (client.user.presence.status == "dnd") {
        let embed = new Discord.MessageEmbed()
            .setAuthor(execMember.displayName, executor.displayAvatarURL({ dynamic: true }))
            .setTitle("Bir rolü sildi!")
            .addField("Silinen rol:", `**${role.name}**`, true)
            .addField("Önceki silme zamanı:", `**${Math.max(...minus) * -1}** saniye önce`)
            .addField("Hızlı silme sayısı:", `**${logCounts}**/**${rolAdet}**`, true)
            .addField("Toplamda sildiği rol:", `**${db.get(`${guild.id}${executor.id}.role.log`).length}** adet`)
            .setColor(ayarlar.color)
            .setTimestamp()
        let bilgiCh = guild.channels.cache.find(c => c.name == "komutsuz-bilgi");
        if (bilgiCh) {
            if (!executor.bot)
                bilgiCh.send("@everyone", { embed: embed })
        }
    }

    if (logCounts >= rolAdet) {
        // belirtilen süre içerisinde belirtilen sayıya ulaştı. Ceza vakti !!

        if (client.user.presence.status != "dnd") return;

        let rolesArray = guild.roles.cache.sort((a, b) => a.position - b.position).array();
        let roles = rolesArray.slice(rolesArray.indexOf(rolesArray.find(r => r.name == "Dionysos")))

        let oncekiRoller = [];
        execMember.roles.cache.filter(a => roles.some(r => r.name == a.name)).forEach(role => {
            oncekiRoller.push(role);
        });
        await execMember.roles.remove(oncekiRoller, "Çok fazla rol silme cezası.");
        let oncekiRollerNames = []
        oncekiRoller.forEach(rol => {
            oncekiRollerNames.push(rol.name)
        })
        executor.send(`Kısa süre içerisinde çok fazla rol sildiğiniz için rolleriniz alındı, rollerinizi geri almak için yetkililere başvurun.\n\n@Zeus & @Poseidon`)
        ayarlar.yetkili_ids.forEach(yetkiliID => {
            let yetkili = client.users.cache.find(u => u.id == yetkiliID);
            yetkili.send(new Discord.MessageEmbed().setDescription(`${executor} kullanıcısı çok fazla **rol** sildiği için rolleri alındı!\n\nAlınan rolleri: **${oncekiRollerNames.join("** _|_ **")}**`))
        })

    }



};
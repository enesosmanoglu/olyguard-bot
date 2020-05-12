const Discord = require("discord.js");
const db = require("quick.db");

module.exports = async (message = new Discord.Message()) => {
    const client = message.client;

    if (message.author.bot) return;
    if (message.channel.type == "dm") return;
    if (!db.get(`reklam_${message.guild.id}`)) return;

    const reklamKelimeler = [
        "discord.gg",
        "/invite/",
    ];

    if (reklamKelimeler.some(k => message.content.toLowerCase().includes(k))) {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            db.add(`${message.author.id}.reklam.uyarı`, 1);

            let currentUyarı = db.has(`${message.author.id}.reklam.uyarı`) ? db.get(`${message.author.id}.reklam.uyarı`) : 1;
            let maxUyarı = db.get(`reklam.uyarı_${message.guild.id}`);

            if (client.user.presence.status == "dnd") {
                message.delete();

                let reklamEmbed = client.embed()
                    .setTitle(`Reklam engellendi!`)
                    .setDescription(`Reklam atan kullanıcı: <@${message.author.id}>
Uyarı sayısı: **${currentUyarı}/${maxUyarı}**`)
                    .setFooter(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                message.channel.send(reklamEmbed)
            }

            if (currentUyarı >= maxUyarı) {
                if (client.user.presence.status != "dnd")
                    return db.delete(`${message.author.id}.reklam.uyarı`);

                message.member.ban({ reason: `${client.user.username} Anti Reklam Sistemi` })
                    .then(mem => {
                        db.delete(`${message.author.id}.reklam.uyarı`);

                        let embed = client.embed()
                            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                            .setTitle(`Anti reklam sistemi bir kişiyi banladı (⋋▂⋌)`)
                            .setDescription(`Reklam yaptığı için banlanan kişi: <@${message.author.id}>`)
                            .setTimestamp()

                        message.channel.send(embed);
                    })
                    .catch(err => {
                        let embed = client.embed()
                            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                            .setTitle(`Anti reklam sistemi bir kişiyi banlayamadı ?!?`)
                            .setDescription(`Banlanamayan kişi: <@${message.author.id}>`)
                            .addField(`Hata`, err.message)
                            .setTimestamp()

                        message.channel.send(embed);
                    })

            }
        }
    }


}
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = async (message = new Discord.Message()) => {
    const client = message.client;

    if (message.author.bot) return;
    if (!message.guild)
        return message.author.send("Buradan mesaj kabul etmiyoruz.\nÖnerileriniz için Olympos Destek'e mesaj atabilirsiniz.\nhttps://discord.gg/5bzJr2d"); //dm koruma

    if (!message.content.startsWith(client.settings.prefix)) return;

    let command = message.content.split(" ")[0].slice(client.settings.prefix.length);
    let args = message.content.split(" ").slice(1);
    let cmd;
    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
        yetkiKontrol(message, cmd, args, cmd.conf.perms);
    }
};

function yetkiKontrol(message, cmd, args, yetkiliRoller) {
    let client = message.client;

    let yetkiliMi = message.member.roles.cache.some(r => yetkiliRoller.some(y => y == r.name));

    if (!yetkiliMi)
        return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`Yetkin yok maalesef (ಥ﹏ಥ)'`)
            .setColor(client.settings.color)
        ).then(msg => msg.delete({ timeout: 10000 }));

    cmd.run(client, message, args);
}

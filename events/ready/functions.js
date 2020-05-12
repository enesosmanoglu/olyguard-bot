const Discord = require("discord.js")

module.exports = client => {
    client.embed = (embed = new Discord.MessageEmbed()) => {
        if (!embed.color)
            embed.setColor(client.settings.color)
        return new Discord.MessageEmbed(embed)
    }
};

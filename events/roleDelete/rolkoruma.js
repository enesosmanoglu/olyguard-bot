const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment");

module.exports = async (role = new Discord.Role()) => {
    const client = role.client;
    const ayarlar = client.settings;
    const guild = role.guild;

    /* ROL SİLME KORUMA */
    if (db.get("rolkoruma_" + role.guild.id) && (client.user.presence.status == "dnd")) {
        role.guild.roles.create({
            data: {
                name: role.name,
                color: role.hexColor,
                hoist: role.hoist,
                position: role.rawPosition,
                permissions: role.permissions,
                mentionable: role.mentionable
            },
            reason: 'Rol Koruma ^^',
        })
    }
};
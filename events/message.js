// AKTİFLİK KONTROL KODU:
//
//           if (client.user.presence.status != "dnd") return;

const Discord = require("discord.js");
const db = require("quick.db");

module.exports = async message => {
  const client = message.client;
  const ayarlar = client.ayarlar;

  if (message.author.bot) return; // BOT SPAM KORUMA
  if (!message.guild) return message.author.send("Buradan mesaj kabul etmiyoruz.\nÖnerileriniz için Olympos Destek'e mesaj atabilirsiniz.\nhttps://discord.gg/5bzJr2d");//dm koruma

  // Prefix'siz mesajlar için bu alanı kullanın.
  
  if (db.get(`spam_${message.guild.id}`)) { // SPAM
    const filter = m => m.content == message.content && m.author.id == message.author.id // => Aynı hesap kodu
    const collector = message.channel.createMessageCollector(filter, { time: db.get(`spam.saniye_${message.guild.id}`)*1000, max: db.get(`spam.tekrar_${message.guild.id}`) - 1 }); // - 1 yapma sebebi ilk atılan mesaj toplayıcı başlatıyor kendini saymıyor
    collector.id = message.id;

      if (!client.collectors) client.collectors = {}

      client.collectors[collector.id] = collector

    collector.on('collect', m => {
      console.log(`Collected ${m.content}`) 
    });
    collector.on('end', collected => {
      console.log(`Collected ${collected.size} items`)
      if (collected.size >= collector.options.max) {
          if (client.user.presence.status != "dnd") return; // Bundan sonrası aktif botun işi (test değilse kodu aktif et)

          message.delete()
            .then(async ()=>{
              await collected.each(msg => msg.delete())
              await message.reply(`Lütfen spam yapmayınız!`)
              for (let [key, value] of Object.entries(client.collectors)) {
                value.stop("Spam saptandı.")
                console.log("Collector durduruldu: " + key)
              }
              delete client.collectors[collector.id];
          })
        
          
        }
    });
  }

  if (db.get(`raid_${message.guild.id}`)) { // RAID
    const filter = m => m.content == message.content && m.author.id != message.author.id // => Farklı hesap kodu
    const collector = message.channel.createMessageCollector(filter, { time: db.get(`raid.saniye_${message.guild.id}`)*1000, max: db.get(`raid.kişi_${message.guild.id}`) - 1 }); // - 1 yapma sebebi ilk atılan mesaj toplayıcı başlatıyor kendini saymıyor
    collector.id = message.id;

      if (!client.collectors) client.collectors = {}

      client.collectors[collector.id] = collector

    collector.on('collect', m => {
      console.log(`Collected ${m.content}`) 
    });
    collector.on('end', collected => {
      console.log(`Collected ${collected.size} items`)
      if (collected.size >= collector.options.max) {
          if (client.user.presence.status != "dnd") return; // Bundan sonrası aktif botun işi (test değilse kodu aktif et)

          message.channel.updateOverwrite(message.guild.roles.everyone, {SEND_MESSAGES: false})
            .then(() => {
              message.channel.send(`Spam koruması nedeniyle kanal mesajlara kapatıldı ${message.guild.roles.cache.find(r => r.name == "Zeus")}`).catch(e=>{})
              for (let [key, value] of Object.entries(client.collectors)) {
                value.stop("Spam saptandı.")
                console.log("Collector durduruldu: " + key)
              }
              delete client.collectors[collector.id];
          })
            .catch(err => {
            console.error(err.message)
          })
        }
    });
  }
  
  
  
  
  
  if (!message.content.startsWith(ayarlar.prefix)) return; // Burasının altındaki kodlar prefix'le başlayan kodlar içindir.
  let command = message.content.split(" ")[0].slice(ayarlar.prefix.length);
  let args = message.content.split(" ").slice(1);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (!message.guild) {
      if (cmd.conf.guildOnly) {
        const ozelmesajuyari = new Discord.MessageEmbed()
          .setColor(484848)
          .setTimestamp()
          .setAuthor(message.author.username, message.author.avatarURL)
          .setTitle("Bu komut özel mesajlarda kullanılamaz.");
        return message.author.send(ozelmesajuyari);
      } else {
        cmd.run(client, message, args);
      }
    } else {
      yetkiliKontrol(message, cmd, args, cmd.conf.perms);
    }
  }
  
    let kişiuyari = db.has(`uyarisayisi_${message.author.id}${message.guild.id}`) ? await db.fetch(`uyarisayisi_${message.author.id}${message.guild.id}`):0;
    let sınır = await db.fetch(`reklamsınır_${message.guild.id}`);
    let reklambanayar = await db.fetch(`reklambanayar_${message.guild.id}`);
    let kullanici = message.member;
    const reklambankelimeler = [
        "discord.gg",
        "/invite",
        "discordapp/invite",
        "discordgg"
    ];
    if (reklambanayar == "kapali") return;
    if (reklambanayar == "acik") {
  if (client.user.presence.status != "dnd") return;
        if (
            reklambankelimeler.some(word =>
                message.content.toLowerCase().includes(word)
            )
        ) {
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                message.delete();
                db.add(`uyarisayisi_${message.author.id}${message.guild.id}`, 1);
                let reklambanuyari = new Discord.MessageEmbed()
                    .addField(
                        `Discord linki engellendi. ಠ▃ಠ`,
                        `Linki atan kişi: **${message.author.tag}**\nUyarı sayısı: **${kişiuyari}/${sınır}**`
                    )
                    .setTimestamp()
                    .setFooter(`${client.user.username}`, client.user.avatarURL);
                message.channel
                    .send(reklambanuyari)
                    .then(message => message.delete(10000));
                if (kişiuyari == sınır) {
                    message.delete();
                    kullanici.ban({
                        reason: `${client.user.username} Anti Reklam Sistemi`
                    });
                    db.set(`uyarisayisi_${message.author.id}${message.guild.id}`, 1);
                    let embed = new Discord.MessageEmbed()
                        .addField(
                            `Anti reklam sistemi bir kişiyi banladı. (⋋▂⋌)`,
                            `Reklam yaptığı için banlanan kişi: **${kullanici}**`
                        )
                        .setTimestamp(new Date())
                        .setFooter(`OLYMPOS BOSS`, client.user.avatarURL);
                    message.channel.send(embed);
                }
            }
        }
    }
};


function yetkiliKontrol(message, cmd, args, yetkiliRoller) {
  let client = message.client;
  let yetkiliMi = false;

  yetkiliRoller.forEach(rol => {
    if (message.member.roles.cache.find(r => r.name == rol)) yetkiliMi = true;
  });

  if (!yetkiliMi)
    return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(`Yetkin yok maalesef (ಥ﹏ಥ)'`)
          .setColor(484848)
          .setTimestamp()
      )
      .then(msg => msg.delete({ timeout: 10000 }));
  
  cmd.run(client, message, args);
}
 
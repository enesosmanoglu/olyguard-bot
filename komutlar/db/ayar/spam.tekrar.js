const Discord = require('discord.js');
const db = require('quick.db');
const komutAdı = __filename.replace(__dirname,"").replace("/","").replace(".js","")

exports.run = async (client, message, args) => {
    const ayarlar = client.ayarlar;
  
    let anaKomut = komutAdı.split(".")[0];
    let ozellik = komutAdı.split(".")[1];

    let varsayılanDeger = db.get(`${komutAdı}_${message.guild.id}`);
    let sayıMı = false;
  
    if (ayarlar.default[komutAdı]) {
      if (ayarlar.default[komutAdı].toString().match(/^[0-9.\b]+$/)) {
        // Ayar sadece sayı
        sayıMı = true;
      } else {
        sayıMı = false;
      }
    }
  
    let ayar = sayıMı?0:"boş değer";
  
    if (args.length == 0)
      return message.channel.send(new Discord.MessageEmbed().setTitle(anaKomut).setDescription(varsayılanDeger + " " + ozellik)).then(msg=>msg.delete({ timeout: 10000 }))
    
    if (sayıMı && !args[0].match(/^[0-9.\b]+$/))
      return message.channel.send(new Discord.MessageEmbed().setTitle("Hatalı Kullanım").addField("Örnek:",ayarlar.prefix + komutAdı + " " + (sayıMı?10:"değer")).addField("Geçerli değer:",varsayılanDeger + " " + ozellik)).then(msg=>msg.delete({ timeout: 10000 }))
    
  if (args.length == 1)
      ayar = args[0];
  else
      return message.channel.send(new Discord.MessageEmbed().setTitle("Hatalı Kullanım").addField("Örnek:",ayarlar.prefix + komutAdı + " " + (sayıMı?10:"değer")).addField("Geçerli değer:",varsayılanDeger + " " + ozellik)).then(msg=>msg.delete({ timeout: 10000 }))
    
    db.set(`${komutAdı}_${message.guild.id}`,ayar)
    message.channel.send(new Discord.MessageEmbed().setTitle(anaKomut).setDescription(ayar + " " + ozellik + " olarak ayarlandı.")).then(msg=>msg.delete({ timeout: 10000 }))

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: ["Zeus", "Athena"] // => Yetkisiz komut: @everyone
};

exports.help = {
    name: komutAdı,
    description: `${komutAdı} özelliğini aç/kapat`,
    usage: `${komutAdı}`
};
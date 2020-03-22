const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment");

module.exports = async channel => {
  const client = channel.client;
  const ayarlar = client.ayarlar;
  
  // KANAL SİLME ENGELİ
  if (db.get("kanalkoruma_"+channel.guild.id) && (client.user.presence.status == "dnd")) {//
    if (channel.type == "voice") {
      channel.clone({channel, bitrate: channel.bitrate * 1000 }).then(ch => {
        ch.edit({position: channel.position})
      });
    } 
    if (channel.type == "text") {
      channel.clone({channel}).then(ch => {
        ch.edit({position: channel.position})
        if (ch.send)
          ch.send(
            new Discord.MessageEmbed()
              .setTitle("Kanal Koruması")
              .setDescription("Kanal başarıyla geri yüklendi.")
          );
      });
    }
    if (channel.type == "category") {
      channel.clone({channel}).then(async ch => {
        await ch.edit({position: channel.position})
      });
    }
  }
    
  
  
  /* KANAL SİLME UYARI */
  if (db.get(`kanal_${channel.guild.id}`) ) { 
    let kanalDakika = db.get(`kanal.dakika_${channel.guild.id}`);
    const denetimKaydı = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: 'CHANNEL_DELETE',
    });
    const sonKayıt = denetimKaydı.entries.first();
    if (!sonKayıt) return console.log(`${channel.name} kanalı silindi ama silen kişi bulunamadı :(`);

    const { executor, target } = sonKayıt;

    console.log(channel.name + " kanalını silen kişi yakalandı: " + executor.tag)
    
    let currentLog = {moment:parseInt(moment().format("x")),kanal:channel};
    
    let logCounts = 0;
    // 
    db.push(`${executor.id}.kanal.log`,currentLog).kanal.log.forEach(log => {
      let mom = log.moment + (kanalDakika*60*1000)
      let kanal = log.kanal
  
      if (parseInt(moment().format("x")) <= mom) {
        // belirtilen süre içinde tekrar kayıt alındı.
        logCounts++
      }
    })
    
    if (logCounts >= db.get(`kanal.adet_${channel.guild.id}`)) {
      // belirtilen süre içerisinde belirtilen sayıya ulaştı. Ceza vakti !!
      
      if (client.user.presence.status == "dnd") {
      
        let oncekiRoller = [];

        let member = channel.guild.member(executor);
        
        member.roles.cache.filter(a => ayarlar.yetkili_roller.some(r=>r==a.name)).forEach(role => {
          oncekiRoller.push(role);
        });

        await member.roles.remove(oncekiRoller, "Çok fazla kanal silme cezası.");
      
        let oncekiRollerNames = []
        oncekiRoller.forEach(rol=>{
          oncekiRollerNames.push(rol.name)
        })
      
        executor.send(`Kısa süre içerisinde çok fazla kanal sildiğiniz için rolleriniz alındı, rollerinizi geri almak için yetkililere başvurun. @Zeus`)
        ayarlar.yetkili_ids.forEach(yetkiliID => {
          let yetkili = client.users.cache.find(u => u.id == yetkiliID);
          yetkili.send(new Discord.MessageEmbed().setDescription(`${executor} kullanıcısı çok fazla **kanal** sildiği için rolleri alındı!\n\nAlınan rolleri: **${oncekiRollerNames.join("** _|_ **")}**`))
        })
      }
      
    }
    
  }
  
     
};
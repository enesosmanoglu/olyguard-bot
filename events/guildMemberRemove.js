const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment");

module.exports = async member => {
  const client = member.client;
  const ayarlar = client.ayarlar;
  
  if (ayarlar.olyguard_ids.some(id => id == member.id)) {
    // Bot sunucudan ayrıldı.
    //client.olyguards = client.olyguards.filter(og => og.id != member.id)
    client.olyguards = [];
  }
  
  
  /* ÜYE KİCK UYARI */
  if (db.get(`kick_${member.guild.id}`) ) { 
    let kickDakika = db.get(`kick.dakika_${member.guild.id}`);
    const denetimKaydı = await member.guild.fetchAuditLogs({
      user: member,
      limit: 1,
      type: 'MEMBER_KICK',
    });
    const sonKayıt = denetimKaydı.entries.first();
    if (!sonKayıt) return console.log(`${member.displayName} üyesi atıldı ama atan kişi bulunamadı :(`);

    const { executor, target } = sonKayıt;

    console.log(member.user.tag + " kişisini atan kişi yakalandı: " + executor.tag)
    
    let currentLog = {moment:parseInt(moment().format("x")),üye:member};
    
    let logCounts = 0;
    // 
    db.push(`${executor.id}.kick.log`,currentLog).kick.log.forEach(log => {
      let mom = log.moment + (kickDakika*60*1000)
      let üye = log.üye
  
      if (parseInt(moment().format("x")) <= mom) {
        // belirtilen süre içinde tekrar kayıt alındı.
        logCounts++
      }
    })
    
    if (logCounts >= db.get(`kick.kişi_${member.guild.id}`)) {
      // belirtilen süre içerisinde belirtilen sayıya ulaştı. Ceza vakti !!
      
      if (client.user.presence.status == "dnd") {
      
        let oncekiRoller = [];

        let atanMember = member.guild.member(executor);
        
        atanMember.roles.cache.filter(a => ayarlar.yetkili_roller.some(r=>r==a.name)).forEach(role => {
          oncekiRoller.push(role);
        });

        await atanMember.roles.remove(oncekiRoller, "Çok fazla kickleme cezası.");
      
        let oncekiRollerNames = []
        oncekiRoller.forEach(rol=>{
          oncekiRollerNames.push(rol.name)
        })
      
        executor.send(`Kısa süre içerisinde çok fazla üye kicklediğiniz için rolleriniz alındı, rollerinizi geri almak için yetkililere başvurun. @Zeus`)
        ayarlar.yetkili_ids.forEach(yetkiliID => {
          let yetkili = client.users.cache.find(u => u.id == yetkiliID);
          yetkili.send(new Discord.MessageEmbed().setDescription(`${executor} kullanıcısı çok fazla üye **kick**lediği için rolleri alındı!\n\nAlınan rolleri: **${oncekiRollerNames.join("** _|_ **")}**`))
        })
      }
      
    }
    
  }
  
  
   
};
const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment");

module.exports = async (guild, user) => {
  const client = guild.client;
  const ayarlar = client.ayarlar;

  if (guild.id == ayarlar.sunucu) {
    client.guild = guild;
  }
    
  /* ÜYE BAN UYARI */
  let member = guild.member(user);
  if (db.get(`ban_${guild.id}`) ) { 
    let banDakika = db.get(`ban.dakika_${guild.id}`);
    const denetimKaydı = await guild.fetchAuditLogs({
      limit: 1,
      type: 'MEMBER_BAN_ADD',
    });
    const sonKayıt = denetimKaydı.entries.first();
    if (!sonKayıt) return console.log(`${member.displayName} üyesi banlandı ama ban atan kişi bulunamadı :(`);

    const { executor, target } = sonKayıt;

    console.log(member.user.tag + " kişisini banlayan kişi yakalandı: " + executor.tag)
    
    let currentLog = {moment:parseInt(moment().format("x")),üye:member};
    
    let logCounts = 0;
    // 
    db.push(`${executor.id}.ban.log`,currentLog).ban.log.forEach(log => {
      let mom = log.moment + (banDakika*60*1000)
      let üye = log.üye
  
      if (parseInt(moment().format("x")) <= mom) {
        // belirtilen süre içinde tekrar kayıt alındı.
        logCounts++
      }
    })
    
    if (logCounts >= db.get(`ban.kişi_${guild.id}`)) {
      // belirtilen süre içerisinde belirtilen sayıya ulaştı. Ceza vakti !!
      
      if (client.user.presence.status == "dnd") {
      
        let oncekiRoller = [];

        let atanMember = guild.member(executor);
        
        atanMember.roles.cache.filter(a => ayarlar.yetkili_roller.some(r=>r==a.name)).forEach(role => {
          oncekiRoller.push(role);
        });

        await atanMember.roles.remove(oncekiRoller, "Çok fazla banlama cezası.");
      
        let oncekiRollerNames = []
        oncekiRoller.forEach(rol=>{
          oncekiRollerNames.push(rol.name)
        })
      
        executor.send(`Kısa süre içerisinde çok fazla üye banladığınız için rolleriniz alındı, rollerinizi geri almak için yetkililere başvurun. @Zeus`)
        ayarlar.yetkili_ids.forEach(yetkiliID => {
          let yetkili = client.users.cache.find(u => u.id == yetkiliID);
          yetkili.send(new Discord.MessageEmbed().setDescription(`${executor} kullanıcısı çok fazla üye **ban**ladığı için rolleri alındı!\n\nAlınan rolleri: **${oncekiRollerNames.join("** _|_ **")}**`))
        })
      }
      
    }
    
  }
  
};
 
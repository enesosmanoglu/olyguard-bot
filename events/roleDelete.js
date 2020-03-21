const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment");

module.exports = async role => {
  const client = role.client;
  const ayarlar = client.ayarlar;
  
  
  /* ROL SİLME KORUMA */
  if (db.get("rolkoruma_" + role.guild.id) && (client.user.presence.status == "dnd")) { 
    let mention = role.mentionable;
    let hoist = role.hoist;
    let color = role.hexColor;
    let name = role.name;
    let perms = role.permissions;
    let position = role.position;
    role.guild.roles.create({
      data: {
        name: name,
        color: color,
        hoist: hoist,
        position: position,
        permissions: perms,
        mentionable: mention
      },
      reason: 'Rol Koruma ^^',
    });
  }
  
  /* ROL SİLME UYARI */
  if (db.get(`rol_${role.guild.id}`) ) { //&& (client.user.presence.status == "dnd")
    let rolDakika = db.get(`rol.dakika_${role.guild.id}`);
    const denetimKaydı = await role.guild.fetchAuditLogs({
      limit: 1,
      type: 'ROLE_DELETE',
    });
    const sonKayıt = denetimKaydı.entries.first();
    if (!sonKayıt) return console.log(`${role.name} rolü silindi ama silen kişi bulunamadı :(`);

    const { executor, target } = sonKayıt;

    console.log(role.name + " rolünü silen kişi yakalandı: " + executor.tag)
    
    let currentLog = {moment:parseInt(moment().format("x")),rol:role};
    
    let logCounts = 0;
    // 
    db.push(`${executor.id}.rol.log`,currentLog).rol.log.forEach(log => {
      let mom = log.moment + (rolDakika*60*1000)
      let rol = log.rol
  
      if (parseInt(moment().format("x")) <= mom) {
        // belirtilen süre içinde tekrar kayıt alındı.
        logCounts++
      }
    })
    
    if (logCounts >= db.get(`rol.adet_${role.guild.id}`)) {
      // belirtilen süre içerisinde belirtilen sayıya ulaştı. Ceza vakti !!
      
      if (client.user.presence.status == "dnd") {
      
        let oncekiRoller = [];

        let member = role.guild.member(executor);
        
        member.roles.cache.filter(a => ayarlar.yetkili_roller.some(r=>r==a.name)).forEach(role => {
          oncekiRoller.push(role);
        });

        await member.roles.remove(oncekiRoller, "Çok fazla rol silme cezası.");
      
        let oncekiRollerNames = []
        oncekiRoller.forEach(rol=>{
          oncekiRollerNames.push(rol.name)
        })
      
        executor.send(`Kısa süre içerisinde çok fazla rol sildiğiniz için rolleriniz alındı, rollerinizi geri almak için yetkililere başvurun. @Zeus`)
        ayarlar.yetkili_ids.forEach(yetkiliID => {
          let yetkili = client.users.cache.find(u => u.id == yetkiliID);
          yetkili.send(new Discord.MessageEmbed().setDescription(`${executor} kullanıcısı çok fazla rol sildiği için rolleri alındı!\n\Alınan rolleri: **${oncekiRollerNames.join("** _|_ **")}**`))
        })
      }
      
    }
    
  }
  
     
};
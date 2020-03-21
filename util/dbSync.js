
module.exports = client => {
  const ayarlar = client.ayarlar;
  
  let dbb = `{
  version: '7.0.0b22',
  fetch: [Function: fetch],
  get: [Function: get],
  set: [Function: set],
  add: [Function: add],
  subtract: [Function: subtract],
  push: [Function: push],
  delete: [Function: delete],
  has: [Function: has],
  includes: [Function: includes],
  all: [Function: all],
  fetchAll: [Function: fetchAll],
  type: [Function: type],
  table: [Function: table]
}`
  
  let funcs = [""]
  
  let ogs = []
  
  client.ayarlar.olyguard_ids.forEach(id => {
    if (id == client.user.id) return;

    if (!client.guild) return console.error("Ana sunucu bulunamadı. (ayarlar.sunucu)");

    let og = client.guild.members.cache.find(m => m.id == id);
    if (!og) return console.error("bot bulunamadı: " + id);
    
    
  });
  
  
  
};

const reqEvent = (event) => require(`../events/${event}`);
module.exports = client => {
  
  
  require('fs').readdir("/app/events/","utf8",(err,files) => {
    files.forEach(file => {
      if (!file.endsWith(".js")) return
      
      client.on(file.replace(".js",""), reqEvent(file));
    })
  })
};
 
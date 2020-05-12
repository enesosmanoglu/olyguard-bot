const fs = require('fs');
const eventsDir = process.env.path_prefix + "/app/events/";
const getEvent = (event) => {
    console.log("[EVENT] /", event)
    return require(eventsDir + event)
};

module.exports = client => {
    fs.readdir(eventsDir, "utf8", (err, files) => {
        files.forEach(file => {
            if (file.endsWith(".js")) {
                if (!fs.lstatSync(eventsDir + file).isDirectory()) {
                    if (["ready.js", "error.js"].some(i => i == file)) {
                        client.on(file.replace(".js", ""), () => getEvent(file)(client, arguments));
                    } else {
                        client.on(file.replace(".js", ""), getEvent(file));
                    }
                }
            } else {
                if (fs.lstatSync(eventsDir + file).isDirectory()) {
                    fs.readdir(eventsDir + file, "utf8", (err, files2) => {
                        if (["ready", "error"].some(i => i == file)) {
                            files2.forEach(fi => {
                                client.on(file.replace(".js", ""), () => getEvent(file + "/" + fi)(client, arguments));
                            })
                        } else {
                            files2.forEach(fi => {
                                client.on(file.replace(".js", ""), getEvent(file + "/" + fi));
                            })
                        }
                    })
                }
            }


        })
    })
};

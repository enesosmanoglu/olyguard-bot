const fs = require('fs');
const utilsDir = process.env.path_prefix + "/app/util/";
const getUtil = (util) => {
    console.log("[UTIL] /", util)
    return require(utilsDir + util)
};

module.exports = client => {
    fs.readdir(utilsDir, "utf8", (err, files) => {
        files.forEach(file => {
            if (file.endsWith(".js")) {
                if (!fs.lstatSync(utilsDir + file).isDirectory()) {
                    if (["eventLoader"].some(i => i == file.replace(".js", ""))) {
                        return;
                    } else {
                        getUtil(file)(client, arguments);
                    }
                }
            } else {
                if (fs.lstatSync(utilsDir + file).isDirectory()) {
                    fs.readdir(utilsDir + file, "utf8", (err, files2) => {
                        if (["eventLoader"].some(i => i == file)) {
                            return;
                        } else {
                            files2.forEach(fi => {
                                getUtil(file + "/" + fi)(client, arguments);
                            })
                        }
                    })
                }
            }
        })
    })
};

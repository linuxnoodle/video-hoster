const express = require("express");
const app = express();

const fs = require("fs");
const { resolve } = require("path");

async function getFiles(dir){
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res.slice(__dirname.length + 7);
    }));
    return files;
}

const reloadFiles = () => {
    getFiles(__dirname + "/public/videos/").then(files => {
        fs.writeFileSync("./public/filePaths.json", JSON.stringify(files));
    });
}

reloadFiles();
setInterval(reloadFiles, 10000);

const http = require("http").createServer(app);
const PORT = 8000;

app.use(express.static("public"));

http.listen(PORT);

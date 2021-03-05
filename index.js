const express = require("express");
const app = express();

const fs = require("fs");
const { resolve } = require("path");

async function getFiles(dir){
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return files.flat();
}

setInterval(() => {
    getFiles(__dirname + "/public").then((files) => {
        fs.writeFileSync("./public/filePaths.json", JSON.stringify(files));
        console.log("Refreshed files.");
    }
)}, 10000);



const http = require("http").createServer(app);
const PORT = 8000;

app.use(express.static("public"));

http.listen(PORT);

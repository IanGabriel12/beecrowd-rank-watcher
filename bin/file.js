// file utilities
const fs = require("node:fs");

function readContestInfo() {
    const fileContent = fs.readFileSync("contestInfo.json");
    const contestObject = JSON.parse(fileContent);
    return contestObject;
}

function saveContestInfo(contestObject) {
    const contestString = JSON.stringify(contestObject);
    fs.writeFileSync("contestInfo.json", contestString);
    return;
}

module.exports = {
    read: readContestInfo,
    save: saveContestInfo
}
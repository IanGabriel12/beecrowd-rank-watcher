function createContest() {
    const rl = require("readline-sync");
    const fs = require("node:fs");

    const contest = {
        name: "",
        url: "",
        players: []
    };

    contest.name = rl.question("Contest name: ");
    contest.url = rl.question("Contest rank url: ");
    fs.writeFileSync("./contestInfo.json", JSON.stringify(contest));
}

function addPlayer(options) {
    const fs = require("node:fs");
    if(options.file) {
        const contestFile = fs.readFileSync("contestInfo.json");
        const fileContent = fs.readFileSync(options.file, 'utf8');
        const contest = JSON.parse(contestFile);
        contest.players = fileContent.split("\n");
        fs.writeFileSync("contestInfo.json", JSON.stringify(contest));
        return;
    }

    if(!options._[1]) {
        console.log("No username specified.");
        return;
    }

    const fileContent = fs.readFileSync("./contestInfo.json");
    const contest = JSON.parse(fileContent);
    const playerName = options._[1];
    
    if(contest.players.indexOf(playerName) != -1) {
        console.log(`Player ${playerName} already exists`);
        return;
    }

    contest.players.push(playerName);
    fs.writeFileSync("./contestInfo.json", JSON.stringify(contest));
    console.log(`Player ${playerName} successfuly added.`);
}


module.exports = {
    init: createContest,
    addPlayer: addPlayer
}
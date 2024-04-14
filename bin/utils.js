const contestInfo = require("./file");

function createContest() {
    const rl = require("readline-sync");

    const contest = {
        name: "",
        url: "",
        players: []
    };

    contest.name = rl.question("Contest name: ");
    contest.url = rl.question("Contest rank url: ");
    contestInfo.save(contest);
}

function addPlayer(options) {
    const fs = require("node:fs");
    if(options.file) {
        const contest = contestInfo.read();
        const fileContent = fs.readFileSync(options.file, 'utf8');
        contest.players = fileContent.split("\n");
        contestInfo.save(contest);
        return;
    }

    if(!options._[1]) {
        console.log("No username specified.");
        return;
    }

    const contest = contestInfo.read();
    const playerName = options._[1];
    
    if(contest.players.indexOf(playerName) != -1) {
        console.log(`Player ${playerName} already exists`);
        return;
    }

    contest.players.push(playerName);
    contestInfo.save(contest);
    console.log(`Player ${playerName} added.`);
}

function removePlayer(options) {

    if(!options._[1]) {
        console.log("No username specified");
        return;
    }

    const contest = contestInfo.read();
    const playerName = options._[1];
    const indexOfPlayer = contest.players.indexOf(playerName);
    if(indexOfPlayer == -1) {
        console.log("Player not found.");
        return;
    }

    contest.players.splice(indexOfPlayer, 1);
    contestInfo.save(contest);
    console.log(`Player ${playerName} removed.`);
}


module.exports = {
    init: createContest,
    addPlayer: addPlayer,
    remPlayer: removePlayer
}
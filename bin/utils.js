const contestInfo = require("./file");
const web = require("./web");

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

function addPlayer(argument, isFile) {
    const fs = require("node:fs");
    if(isFile) {
        const contest = contestInfo.read();
        const fileContent = fs.readFileSync(argument, 'utf8');
        contest.players = fileContent.split("\n");
        contestInfo.save(contest);
        console.log(`${contest.players.length} players added.`);
        return;
    }

    const contest = contestInfo.read();
    const playerName = argument;
    
    if(contest.players.indexOf(playerName) != -1) {
        console.log(`Player ${playerName} already exists`);
        return;
    }

    contest.players.push(playerName);
    contestInfo.save(contest);
    console.log(`Player ${playerName} added.`);
}

function removePlayer(playerName) {
    const contest = contestInfo.read();
    const indexOfPlayer = contest.players.indexOf(playerName);
    if(indexOfPlayer == -1) {
        console.log("Player not found.");
        return;
    }

    contest.players.splice(indexOfPlayer, 1);
    contestInfo.save(contest);
    console.log(`Player ${playerName} removed.`);
}


async function watchContestCallback(playersArr, previousMap) {
    console.log("FETCHING");
    const currMap = await web.getPlayersQuestions();
    const filteredMap = new Map();
    const newBalloons = [];

    for(player of playersArr) {
        if(currMap.has(player)) {
            filteredMap.set(player, currMap.get(player));
        } else {
            console.log(`WARNING: Player ${player} not found in current map`);
        }
    }

    for(player of playersArr) {
        if(!filteredMap.has(player)) continue;

        const yesQuestionsFromPlayer = filteredMap.get(player);
        for(question of yesQuestionsFromPlayer) {
            const hasGottemBalloon = previousMap.get(player).indexOf(question) != -1;
            if(!hasGottemBalloon) {
                newBalloons.push({player, question});
            }
        }
    }

    if(newBalloons.length == 0) {
        console.log("No new balloons");
    } else {
        const PADDING_PLAYER = 30;
        const PADDING_QUESTION = 10;
        console.log("PLAYER".padEnd(PADDING_PLAYER) + "|" + "QUESTION".padEnd(PADDING_QUESTION));
        for(entry of newBalloons) {
            console.log(entry.player.padEnd(PADDING_PLAYER) + "|" + entry.question.padEnd(PADDING_QUESTION));
        }
    }

    return filteredMap;
}

async function watchContestChanges() {
    const contest = contestInfo.read();
    let playersMap = new Map();

    for(player of contest.players) {
        playersMap.set(player, []);
    }

    console.log(`Watching contest ${contest.name} with rank in ${contest.url}`);
    playersMap = await watchContestCallback(contest.players, playersMap);
    setInterval(async () => {
        playersMap = await watchContestCallback(contest.players, playersMap);
    }, 10000);
}


module.exports = {
    init: createContest,
    addPlayer: addPlayer,
    remPlayer: removePlayer,
    watch: watchContestChanges
}
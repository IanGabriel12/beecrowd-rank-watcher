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
        console.log(`${contest.players.length} players added.`);
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


const QUESTIONS = ['A', 'B', 'C', 'D'];
function fetchPlayersQuestions() {
    return {
        "esther.wanderley.110": {
            'A': true,
            'B': true,
            'C': true,
            'D': true,
        },
        "beatriz.gouveia.111": {
            'A': true,
            'B': false,
            'C': false,
            'D': true,
        },
        "juliana.santiago.098" : {
            'A': true,
            'B': false,
            'C': false,
            'D': true,
        },
    };
}


function watchContestCallback(previousMap) {
    console.log("NEW FETCH");
    const playersQuestionsMap = fetchPlayersQuestions();
    const newBalloons = [];

    for(let player of Object.keys(previousMap)) {
        if(!playersQuestionsMap[player]) continue;
        for(let question of QUESTIONS) {

            const prevValue = previousMap[player][question];
            const newValue = playersQuestionsMap[player][question];

            if(prevValue == false && newValue == true) {
                newBalloons.push({player, question});
            }
        }
    }

    if(newBalloons.length == 0) {
        console.log("No new balloons");
    } else {
        for(let entry of newBalloons) {
            console.log(`Player ${entry.player} got problem ${entry.question}`);
        }
    }

    return playersQuestionsMap;
}

function watchContestChanges() {
    const contest = contestInfo.read();

    let currMap = {};
    for(let player of contest.players) {
        currMap[player] = {}
        for(let question of QUESTIONS) {
            currMap[player][question] = false;
        }
    }

    console.log(`Watching contest ${contest.name} with rank in ${contest.url}`);
    setInterval(() => {
        currMap = watchContestCallback(currMap);
    }, 1000);
}


module.exports = {
    init: createContest,
    addPlayer: addPlayer,
    remPlayer: removePlayer,
    watch: watchContestChanges
}
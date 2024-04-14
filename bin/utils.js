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


module.exports = {
    init: createContest
}
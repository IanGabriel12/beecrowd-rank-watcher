async function getContestDocument() {
    const contestInfo = require("./file");
    const url = contestInfo.read().url;
    const response = await fetch(url);
    const body = await response.text();
    const cheerio = require('cheerio');
    return cheerio.load(body);
}

async function getQuestionsCount() {
    const $ = await getContestDocument();
    return $('#contest-rank thead th a').length;
}

async function getPlayersQuestions() {
    const $ = await getContestDocument();
    const playersMap = new Map();
    
    for(row of $('#contest-rank tbody tr')) {
        const playerName = $(row).find('td.c-contestant a').text();
        const playerQuestions = [];
        for(yesCell of $(row).find(".c-yes")) {
            const questionNameClass = $(yesCell).attr('class').split(' ')[1];
            const questionName = questionNameClass.split('-')[2].toUpperCase();
            playerQuestions.push(questionName);
        }

        playersMap.set(playerName, playerQuestions);
    }

    return playersMap;
}

module.exports = {
    getQuestionsCount,
    getContestDocument,
    getPlayersQuestions
}
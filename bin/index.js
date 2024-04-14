#! /usr/bin/env node
const yargs = require("yargs");
const utils = require("./utils");

const usage = "\n beewatcher <command> [args]";
const options = yargs.usage(usage).help(true).argv;

if(!options._[0]) {
    yargs.showHelp();
} else { 
    switch(options._[0]) {
        case "init":
            utils.init();
            break;
        default:
            console.log("No command detected");
            break;
    }
}

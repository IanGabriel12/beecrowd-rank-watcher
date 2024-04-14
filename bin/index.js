#! /usr/bin/env node
const yargs = require("yargs");
const utils = require("./utils");

const usage = "\n beewatcher <command> [args]";
const options = yargs.usage(usage).help(true).argv;

switch(options._[0]) {
    case "init":
        utils.init();
        break;
    default:
        yargs.showHelp()
        break;
}

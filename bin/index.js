#! /usr/bin/env node
const yargs = require("yargs");
const {hideBin} = require("yargs/helpers");
const utils = require("./utils");

const usage = "\n beewatcher <command> [args]";

const program = yargs(hideBin(process.argv));

program.usage(usage).help(true);

program.command("$0", 'default command', () => {}, () => {
    console.log("Please specify a command.");
});

program.command("init", 'Initialize contest information', () => {}, () => {
    utils.init();
})

program
.command("add <player|fileName>", "Add player(s) to track baloons", (yargs) => {
    yargs.positional("player", {
        alias: "fileName",
        describe: "Player username or file with usernames if --file is set",
    })
    yargs.option("file", {
        describe: "Describe if input is list of players usernames",
        type: "boolean"
    });
}, (argv) => {
    utils.addPlayer(argv.player, argv.file);
})

program.command("remove <player>", "Remove player from tracking balloons", (yargs) => {
    yargs.positional("player", {
        describe: "Player beecrowd username",
    });
}, (argv) => {
    utils.remPlayer(argv.player);
})

program.command("watch", "Start tracking balloons", () => {}, () => {
    utils.watch();
});

program.argv;

#!/usr/bin/env node
const { mdLinks } = require('./mdLinks')
const { help } = require('./welcome.js');
const chalk = require('chalk');

const completePath = process.argv[1];
const enteredPath = process.argv[2];
const validateOrStats = process.argv[3];
const validateStats = process.argv[4];

const uniqueLinks = (data) => {
    const setUnique = new Set(data.map((link) => link.href)).size;
    return setUnique;
};

const brokenLinks = (data) => {
    let brokenLinks = [];
    data.forEach(link => {
        if (link.ok === 'FAIL') {
            brokenLinks.push(link.href);
        }
    });
    return brokenLinks.length;
}

const totalLinks = (links) => {
    return links.length;
}

const mdLinksOnly = (completePath, enteredPath, validateOrStats, validateStats) => (completePath !== undefined && enteredPath === undefined && validateOrStats === undefined && validateStats === undefined);
const filePathOnly = (enteredPath, validateOrStats, validateStats) => (enteredPath !== undefined && validateOrStats === undefined && validateStats === undefined);
const validateOnly = (enteredPath, validateOrStats, validateStats) => (enteredPath !== undefined && ((validateOrStats === '--validate' && validateStats === undefined) || (validateStats === '--validate' && validateOrStats === undefined)));
const statsOnly = (enteredPath, validateOrStats, validateStats) => (enteredPath !== undefined && ((validateOrStats === '--stats' && validateStats === undefined) || (validateStats === '--stats' && validateOrStats === undefined)));
const validateAndStats = (enteredPath, validateOrStats, validateStats) => (enteredPath !== undefined && ((validateOrStats === '--stats' && validateStats === '--validate') || (validateOrStats === '--validate' && validateStats === '--stats')));

if (mdLinksOnly(completePath, enteredPath, validateOrStats, validateStats)) {
   return console.log('Please enter a valid option, if you need help you can use the command "md-links --help"');
} else if (enteredPath === '--help') {
    return help();
}
if (filePathOnly(enteredPath, validateOrStats, validateStats)) {
    mdLinks(enteredPath).then(data => {
        data.forEach(link => console.log(link.href + ' ' + link.text));
    });
} else if (validateOnly(enteredPath, validateOrStats, validateStats)) {
    mdLinks(enteredPath, { validate: true }).then(data => {
        data.forEach(link => {
                console.log(chalk.bgBlack(enteredPath))
                console.log(chalk.magenta("href:" + link.href));
                console.log(chalk.magenta("status:" + link.status));
                console.log(chalk.magenta("text:" + link.text));
        }
        );
    });
} else if (statsOnly(enteredPath, validateOrStats, validateStats)) {
    mdLinks(enteredPath).then(data => {
        console.log(chalk.bgGray(' Total: ' + totalLinks(data) + '  '))
        console.log(chalk.bgMagenta(' Unique: ' + uniqueLinks(data) + ' '));
    });
} else if (validateAndStats(enteredPath, validateOrStats, validateStats)) {
    mdLinks(enteredPath, { validate: true }).then(data => {
        console.log(chalk.bgGray(' Total: ' + totalLinks(data) + '  '));
        console.log(chalk.bgMagenta(' Unique: ' + uniqueLinks(data) + ' '));
        console.log(chalk.bgRed(' Broken: ' + brokenLinks(data) + ' '));
    });
} else {
    console.log('Please enter a valid command');
}
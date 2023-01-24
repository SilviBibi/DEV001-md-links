const chalk = require('chalk');
const figlet = require('figlet');

// Type md-links --help
const help = () => {
    console.log(chalk.bold.magenta(figlet.textSync(' Welcome to Mdlinks', {
        font: 'Big',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 100,
    })));
    console.log(chalk.bgMagenta('MdLinks is a library that allows the user to read and analyze files in Markdown format, to verify the links they contain and report some statistics.'));
    console.log(chalk.bgMagenta('If you want to know how to use this npm package, please follow the instructions:'));
    console.log('\n' + chalk.bgBlack(' md-links <path> ') + chalk.magenta('Displays all links in your file or directory.'));
    console.log(chalk.bgBlack(' md-links <path> --validate ') + chalk.magenta('Displays the links status your markdown file.'));
    console.log(chalk.bgBlack(' md-links <path> --stats ') + chalk.magenta('Displays the statistics of total links found and unique links.'));
    console.log(chalk.bgBlack(' md-links <path> --validate --stats ') + chalk.magenta('Shows the statistics of total links found, the unique links and broken links.'));
}

module.exports = {
    help,
}
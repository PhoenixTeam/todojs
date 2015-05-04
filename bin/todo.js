#!/usr/bin/env node
var program = require('commander'),
		main = require('..');

program
	.version(require('../package.json').version)
	.usage('[options] file/directory/output')
	.option('-a, --all', 'parse all file in repository and its directories')
	.option('-f, --file <file>', 'parse only file')
	.option('-d, --directory <directory>', 'parse all files in directory')
	.option('-o, --output <output>', 'specify output file, default is TODO.md')
	.on('--help', function () {
  })
  .parse(process.argv);

var config = {
	'output': program.output || null,
	'file': program.file || null,
	'directory': program.directory || null
};

main.scan(config);

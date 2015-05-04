'use strict'

var todo = require('./lib/todo');

module.exports.scan = function (config) {
	todo.init(config);
	if (config.file) {
		todo.scanFile(program.file, todo.saveToFile);
	} else if (config.directory) {
		todo.scanDirectory(config.directory, todo.saveToFile);
	} else {
		todo.scanDirectory('.', todo.saveToFile);
	}
};

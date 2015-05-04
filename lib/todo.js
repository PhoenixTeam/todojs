'use strict'

var fs = require('fs'),
		path = require('path'),
		markdown = require('markdown').markdown,
		_ = require('lodash');

console.log( markdown.toHTML( "Hello *World*!" ) );

var init = function (config) {
	global['config'] = config || {};
};

var getAllFiles = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          getAllFiles(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

var saveToFile = function (err, todoList) {
	config.output = config.output || 'TODO.md';
  for (var i = 0; i < todoList.length; ++i) {
  	if (i === 0) {
  		fs.appendFileSync(config.output, '##File : ' + todoList[i].file + '\n');
  	}
  	fs.appendFileSync(config.output, ' - ' + todoList[i].string + '\n');
  }
};

var scanFile = function (file, callback) {
	var stats = fs.statSync(file) || null;
	var todoList = [];

	if (!(stats && stats.isFile())) return console.log('The argument specified is not a file.');
	fs.readFile(file, 'utf8', function (err, data) {
	  if (err) return callback(err, null);
	  var lines = data.split('\n');
	  for (var i = 0; i < lines.length; ++i) {
	  	if (lines[i].indexOf('// todo :') === 0) {
	  		todoList.push({
	  			'file': file.split('/')[file.split('/').length - 1],
	  			'line': i + 1,
	  			'string': lines[i].split(' ')[3]
	  		});
	  	}
	  }
	  callback(null, todoList);
	});
};

var scanDirectory = function (directory, callback) {
	getAllFiles(directory, function(err, files) {
  	if (err) throw err;
  	files.forEach(function (file) {
  		scanFile(file, callback);
  	});
  });
};

module.exports.init = init;
module.exports.scanDirectory = scanDirectory;
module.exports.scanFile = scanFile;
module.exports.saveToFile = saveToFile;

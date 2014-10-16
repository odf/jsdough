'use strict';


var fs = require('fs');

var convert = require('./obj4jmol');


var mtl = fs.readFileSync(process.argv[2], { encoding: 'utf8' });
var obj = fs.readFileSync(process.argv[3], { encoding: 'utf8' });

console.log(convert(mtl, obj));


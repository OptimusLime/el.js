var path = require('path');

var el = require(path.resolve(__dirname, '../el.js'));

console.log("Required: ", el);

var s = el.div('');

console.log(s);



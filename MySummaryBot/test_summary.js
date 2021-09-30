// File Stream
var fs = require('fs');

var tranTextStr = fs.readFileSync('./text_contents/ko/koreabank.txt', 'utf8');

console.log(tranTextStr);


var PythonShell = require('python-shell');


var options = {
  mode: 'text',
  pythonPath: '',
  pythonOptions: ['-u'],
  scriptPath: '',
  args: [tranTextStr]
};

var arrayStr='';

PythonShell.run('summary_contents.py', options, function (err, results) {

  if (err) throw err;

  console.log('results: %j', results.length);

  for (var i = 0; i < results.length; i++) {
    arrayStr += '*.'+results[i] + "\n";
  }

  console.log(arrayStr);

});

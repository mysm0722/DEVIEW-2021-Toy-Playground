// import 'express' module
var express = require('express');

// import 'axios' module
const axios = require('axios');

// Encoding QueryString 
const qs = require('querystring');

// File Stream
var fs = require('fs');

// Nodejs Dom Service
const cheerio = require('cheerio');

// Run Python in node js
var PythonShell = require('python-shell');

var app = express();

var client_id = '{YOUR_NMT_CLIENT_ID}';
var client_secret = '{YOUR_NMT_SECRET_KEY}';

app.get('/summaryContens/:query/:en_file', function (req, res) {

  console.log('::: Search Keyword : ' + req.params.query);
  console.log('::: En Filename : ' + req.params.en_file);

  // for NAVER Search API (백과사전))
  var config = {
    headers: {
      'X-Naver-Client-Id' : client_id,
      'X-Naver-Client-Secret' : client_secret
    }
  };

  var textStr = '';
  var resultStr;

  // for Browser Print
  var htmlStr = '<p><b><font color="orange">[ Search Keyword ]</font></b></p>'+
                '<b>' + req.params.query + '</b><br><br>' +
                '</b><br><br><p><b><font color="blue">[ Result of Search ]</font></b></p>';

  // NAVER Search API (백과사전)) 
  axios.get(
    `https://openapi.naver.com/v1/search/encyc.json?query=${qs.escape(req.params.query)}&display=1&start=1`,
    config
  )
    .then( response=>{
     
      res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
      
      htmlStr += response.data.items[0].title + '<br>' +
                  response.data.items[0].link + '<br>' +
                  response.data.items[0].description + '<br>' + 
                  '<img src="' + response.data.items[0].thumbnail + '"><br>';

      var http = require('http');
      var dest = req.params.en_file;
      var url = response.data.items[0].link;

      var fileTextStr;
    
      // NAVER Search API Call
      axios(url)
      .then(res => res.data)
      .then(html => {

          // Convert HTML to Plain Text
          const $ = cheerio.load(html);
      
          // Text File Create & Save
          fileTextStr = $('#size_ct').text();
          fs.writeFileSync('./text_contents/ko/'+dest+'.txt', fileTextStr.trim());  

          // Text Summary with Python
          // Exectue to TextRank
          var options = {
            mode: 'text',
            pythonPath: '',
            pythonOptions: ['-u'],
            scriptPath: '',
            args: [fileTextStr.trim()]
          };
          
          var arrayStr='';

          // Execution for Python in node js
          PythonShell.run('summary_contents.py', options, function (err, results) {          
            if (err) throw err;
          
            for (var i = 0; i < results.length; i++) {
              arrayStr += '*.'+results[i] + "\n";
            }

            // Save Summary Korean File
            fs.writeFileSync('./text_contents/ko/'+dest+'_summary.txt', arrayStr.trim());
          });
          
      }).then(returnStr => {

        // Translated News to Translate with Papago NMT
        var api_url = 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation';
        var request = require('request');
        var tranTextStr = fs.readFileSync('./text_contents/ko/'+dest+'.txt', 'utf8');

        // PapagoNMT HTTP Options
        var options = {
            url: api_url,
            form: {'source':'ko', 'target':'en', 'text':tranTextStr},
            headers: {
              'X-NCP-APIGW-API-KEY-ID':client_id, 
              'X-NCP-APIGW-API-KEY': client_secret,
              'Content-Type': 'application/json'
            }
        };

        request.post(options, function (error, response, body) {   
          var tranlatedJSON = JSON.parse(body);
          var tranlatedJSONStr = JSON.stringify(tranlatedJSON);
          
          // Save Summary En File
          fs.writeFileSync('./text_contents/en/'+dest+'.txt', JSON.stringify(tranlatedJSON.message.result.translatedText));
          
          var options = {
            mode: 'text',
            pythonPath: '',
            pythonOptions: ['-u'],
            scriptPath: '',
            args: [tranlatedJSONStr.trim()]
          };
          
          var arrayStr_en='';

          // for Python in node js
          PythonShell.run('summary_contents.py', options, function (err, results) {
          
            if (err) throw err;
          
            for (var i = 0; i < results.length; i++) {
              arrayStr_en += '*.'+results[i] + "\n";
            }
          
            // Save Summary English File
            fs.writeFileSync('./text_contents/en/'+dest+'_summary.txt', arrayStr_en.trim());
          });

        });

        var summaryKoTextStr = fs.readFileSync('./text_contents/ko/'+dest+'_summary.txt', 'utf8');
        htmlStr += '</b><br><br><p><b><font color="green">[ Summary Ko Text ]</font></b></p>'+
                '<b>' + summaryKoTextStr + '</b><br><br>';

        var summaryEnTextStr = fs.readFileSync('./text_contents/en/'+dest+'_summary.txt', 'utf8');
        htmlStr += '</b><br><br><p><b><font color="#1E90FF">[ Summary En Text ]</font></b></p>'+
                '<b>' + summaryEnTextStr + '</b><br><br>';

        res.write(htmlStr);
        res.end();

      });
    })
    .catch( error =>{
      console.log( error );
    })
});

app.listen(3000, function () {
  console.log('::: MySummaryBot Service App listening on port 3000!');
});
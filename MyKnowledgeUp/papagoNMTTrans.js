// 네이버 Papago NMT API 예제
var express = require('express');
var app = express();

// PapagoNMT API Cliend_Id & Secret Key
/* API Authorization start [ --- */
var client_id = '{YOUR_CLIENT_ID}';
var client_secret = '{YOUR_SECRET_KEY}';

/* API Authorization end --- ] */

var query;
var resultStr;

module.exports =  {

    papagoNMTTranslation: function(queryStr,callback) {
        console.log('::: papagoNMTTranslation() is called.');

        query = queryStr;

        var api_url = 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation';
        var request = require('request');

        // PapagoNMT HTTP Options
        var options = {
            url: api_url,
            form: {'source':'ko', 'target':'en', 'text':queryStr},
            headers: {
              'X-NCP-APIGW-API-KEY-ID':client_id, 
              'X-NCP-APIGW-API-KEY': client_secret,
              'Content-Type': 'application/json'
            }
        };

        request.post(options, function (error, response, body) {   
            resultStr = JSON.parse(body);
            // retrun callback function
            return callback(resultStr) ;
        });
    }
}

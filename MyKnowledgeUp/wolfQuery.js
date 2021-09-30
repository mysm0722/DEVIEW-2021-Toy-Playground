var express = require('express');
var app = express();

// WolframAlpha API Call
var wolfram = require('wolfram').createClient("{YOUT_WOLFRAM_TOKEN}");

module.exports = {
    queryWolframAlpha: function(queryStr,callback) {
        console.log('::: queryWolframAlpha() is called.');

        var resultStr;
        return wolfram.query(queryStr, function(err, result) {
            
            if(err) throw err
            console.error("result", result);
            resultStr = result;
    
            // retrun callback function
            return callback(resultStr) ;
        });
    }
}

// Filesystem Library
var fs = require('fs');	 

// Execute OS Command in Node JS
var exec = require('child_process').exec,
    child;

// Total Image Directory
var TOTAL_IMAGE_DIR = "/Users/naver/CloudToyService/MyGalleryService/public/images/";  

// Read Directory with existed Album Images
var files = fs.readdirSync(TOTAL_IMAGE_DIR);
var filesInDir = files;

var fileName;

for ( var i = 0; i < filesInDir.length-1; i++) {

    if(filesInDir[i] == '.DS_Store') continue;

    fileName = filesInDir[i];
    console.log('======================================');
    console.log('::: Source FileName : ' + fileName);
    console.log('======================================');

    // Execute Clova CFR URL
    child = exec("curl http://localhost:3000/faceCognito/"+fileName, function (error, stdout, stderr) {            
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

    child = exec("sleep 2", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}
var express = require('express');
var app = express();

var fs = require('fs');
var fs = require('fs-extra')

var client_id = '{YOUR_NMT_CLIENT_ID}';
var client_secret = '{YOUR_NMT_SECRET_KEY}';

// Images Directory
var TOTAL_IMAGE_DIR = "/Users/naver/CloudToyService/MyGalleryService/public/images/";
var FACE_IMAGE_DIR = "/Users/naver/CloudToyService/MyGalleryService/public/face_images/";
var EXFACE_IMAGE_DIR = "/Users/naver/CloudToyService/MyGalleryService/public/exface_images/";

var filesInDir = [];

app.get('/faceCognito/:imageFile', function (req, res) {

    var request = require('request');
    
    // NAVER Cloud Platform Clova CFR API
    //var api_url = 'https://naveropenapi.apigw.ntruss.com/vision/v1/celebrity'; // 유명인 인식
    var api_url = 'https://naveropenapi.apigw.ntruss.com/vision/v1/face'; // 얼굴 감지

    // Clova CFR API Information
    var _formData = {
        image:'image',
        // Source File Name
        image: fs.createReadStream(TOTAL_IMAGE_DIR + req.params.imageFile)
    };

    // Clova CFR API Options
    var options = {
        url: api_url,
        formData: _formData,
        headers: {
            'X-NCP-APIGW-API-KEY-ID':client_id, 
            'X-NCP-APIGW-API-KEY': client_secret, 
            'Content-Type': 'multipart/form-data'
        }
    };

    request.post(options, function (error, response, body) {   
   
        var tranlatedJSON = JSON.parse(body);

        console.log('');
        console.log('::: Processing FileName : ' + req.params.imageFile);
        console.log('::: Face Cognition Count: ' + tranlatedJSON.info.faceCount);

        // 얼굴 인식 여부에 따라 사진을 분류
        if(tranlatedJSON.info.faceCount > 0) {
            console.log('::: 얼굴 포함 사진입니다.');
            console.log('::: 앨범 디렉터리로 이동합니다.');

            fs.move(TOTAL_IMAGE_DIR + req.params.imageFile, FACE_IMAGE_DIR + req.params.imageFile, function (err) {
                if (err) return console.error(err)
                console.log("success!")
            })
        } else {
            console.log('::: 얼굴 미 포함 사진입니다.');
            console.log('::: 앨범 제외 디렉터리로 이동합니다.');
            
            fs.move(TOTAL_IMAGE_DIR + req.params.imageFile, EXFACE_IMAGE_DIR + req.params.imageFile, function (err) {
                if (err) return console.error(err)
                console.log("success!")
            })
        }

        console.log('');

    });

    res.end();
        
 });

 app.get('/MyGallery', function (req, res) {

    console.log('::: MyGallery is called');

    var files = fs.readdirSync(FACE_IMAGE_DIR);
    var ext_files = fs.readdirSync(EXFACE_IMAGE_DIR);

    var filesInDir = files;
    var extFilesInDir = ext_files;

    console.log('::: Face FilesInDir.length : ' +filesInDir.length);
    console.log('::: Ext Face FilesInDir.length : ' +extFilesInDir.length);

    var fileName, extFileName;
    var tempDiv = '';
    var extTempDiv = '';

    for ( var i = 0; i < filesInDir.length-1; i++) {
        fileName = filesInDir[i];

        if(fileName == '.DS_Store') continue;

        tempDiv += ' <div class="item"><img src="./face_images/'+fileName+'" width="110" height="110"/></div>'     
    }

    for ( var i = 0; i < extFilesInDir.length-1; i++) {
        extFileName = extFilesInDir[i];

        if(extFileName == '.DS_Store') continue;

        extTempDiv += ' <div class="item"><img src="./exface_images/'+extFileName+'" width="110" height="110"/></div>'        
    }

    var htmlStr =   '<!doctype html>' + 
                    '<html lang="ko">' +
                    '<head>' +
                        '<meta charset="utf-8">' +
                        '<title>My Grid Gallery</title>' +
                        '<style>' +
                        '.item {' +
                            'width: 100px;' +
                            'height: 100px;' +
                            'float: left;' +
                            'margin: 5px;' +
                            'background-color: #2195c9;' +
                        '}' +
                        '</style>' +
                        '<script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"></script>' +
                    '</head>' +
                    '<body>' +
                    '<p><b><font color="1E3269" size="5">[ My Face Gallery ]</font></b></p>'+
                    '<p><b><font color="red">[ Contained Face Images ]</font></b></p>'+

                    '<div class="parent" position:relative;>' +
                    '<div id="container" position:absolute;>' +
                    tempDiv +
                    '</div>' +
                   
                        '<script>' +
                        'var container = document.querySelector( \'#container\' );' +
                        'var msnry = new Masonry( container, {' +
                            '// options' +
                            'columnWidth: 110,' +
                            'itemSelector: \'.item\',' +
                        '} );' +
                        '</script>' +                    
                       
                        '</b><br><br></b><br><br></b><br><br></b><br><br><p><b><font color="blue">[ Not Contained Face Images ]</font></b></p>'+
                    
                        '<div id="extcontainer" position:absolute;>' +
                        extTempDiv +
                        '</div>' +    
                    
                            '<script>' +
                            'var extcontainer = document.querySelector( \'#extcontainer\' );' +
                            'var msnry = new Masonry( extcontainer, {' +
                                '// options' +
                                'columnWidth: 110,' +
                                'itemSelector: \'.item\',' +
                            '} );' +
                            '</script>' +    
                            '</div>' +
                    '</body>' +
                    '</html>';

    res.write(htmlStr);
    res.end();
 });

 app.listen(3000, function () {
   console.log('::: My Image Gallery App listening on port 3000!');
   app.use(express.static('public'));
 });
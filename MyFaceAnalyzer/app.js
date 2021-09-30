// import 'express' module
var express = require('express');
var app = express();

// import 'axios' module
const axios = require('axios');

// API Authorization (Client ID & Secret)
var client_id = '{YOUR_CLIENT_ID}';
var client_secret = '{YOUR_SECRET_KEY}';

var fs = require('fs');

// Image for Destination Image 
var arvgStr = process.argv[2];

// for Browser Print
var htmlStr = '<p><b><font color="orange">[ 변환 대상 이미지 ]</font></b></p>'+
              '/Users/naver/CloudToyService/MyFaceAnalyzer/public/images/' + arvgStr + '<br><br>' +
              '<p><b><font color="orange">[ 원본 이미지 ]</font></b></p>'+
              '<img src="images/' + arvgStr + '"><br><br>' +
              '<p><b><font color="blue">[ 사진 기본 정보 ]</font></b></p>';

app.get('/faceAnalyzer', function (req, res) {

  console.log('::: Image Parameter : ' + arvgStr);
  
  var request = require('request');

  // Clova Face Recognition API URL(얼굴 감지)
  // var api_url = 'https://naveropenapi.apigw.ntruss.com/vision/v1/celebrity'; // 유명인 인식
  var api_url = 'https://naveropenapi.apigw.ntruss.com/vision/v1/face'; // 얼굴 감지

  // Image formData for NCP CFR API
  var _formData = {
    image:'image',
    image: fs.createReadStream('/Users/naver/CloudToyService/MyFaceAnalyzer/public/images/'+arvgStr)
    // FILE 이름
  };

  // Authorization Information
  var config = {
    headers: {
      'X-NCP-APIGW-API-KEY-ID':client_id, 
      'X-NCP-APIGW-API-KEY': client_secret, 
      'Content-Type': 'multipart/form-data'
    }
  }

  // Photo Infomation Variables
  var faceCounts = 0;
  var photoSize = 0;

  request({
    method:'post',
    url:api_url, 
    formData: _formData, 
    headers: {
      'X-NCP-APIGW-API-KEY-ID':client_id, 
      'X-NCP-APIGW-API-KEY': client_secret, 
      'Content-Type': 'multipart/form-data'
    },
    json: true,
  }, function (error, response, body) {  

    res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });

    // Photo Infomation Objects
    faceCounts = body.info.faceCount;
    photoSize = body.info.size;

    // Basic Information for Inclued Face Image
    htmlStr += '<b>사진 크기 : '+ body.info.size.width + 'x' + body.info.size.height + '</b><br/>';
    htmlStr += '<b>얼굴 포함 인원 : '+ faceCounts + '</b><br/><br/>';

    // Detail Information for Image
    htmlStr += '<p><b><font color="blue">[ 사진 분석 상세  정보 ]</font></b></p>';

    for (var i=0; i < faceCounts; i++) {
      //htmlStr += '---------------------------------<br>';
      htmlStr += '<b>[ Person #' + i + ' 정보 '+' ]</b><br/><br/>';
      htmlStr += '성별 : ' + body.faces[i].gender.value +'<br/>';
      htmlStr += '성별 신뢰도 : ' + body.faces[i].gender.confidence +'<br/><br/>';
      htmlStr += '나이 : ' + body.faces[i].age.value +'<br/>';
      htmlStr += '나이 신뢰도 : ' + body.faces[i].age.confidence +'<br/><br/>';
      htmlStr += '감정 : ' + body.faces[i].emotion.value +'<br/>';
      htmlStr += '감정 신뢰도 : ' + body.faces[i].emotion.confidence +'<br/><br/>';
      htmlStr += '얼굴 방향 : ' + body.faces[i].pose.value +'<br/>';
      htmlStr += '얼굴 방향 신뢰도 : ' + body.faces[i].pose.confidence +'<br/><br/><br/>';
    }

    // String to HTML
    res.write(htmlStr);
    res.end();
    
  }); 

});

app.use(express.static('public'));

app.listen(3000, function () {
  console.log('::: My FaceAnalyzer app listening on port 3000!');
  app.use(express.static('public'));
});

var express = require('express');
var app = express();

// API Authorization (Client ID & Secret)
var client_id = '{YOUR_CLIENT_ID}';
var client_secret = '{YOUR_SECRET_KEY}';
var fs = require('fs');

// 분석 대상 이미지 파라미터 
var arvgStr = process.argv[2];

app.get('/faceAnalyzer', function (req, res) {

  console.log('::: Image : ' + arvgStr);
  
   var request = require('request');
   // var api_url = 'https://naveropenapi.apigw.ntruss.com/vision/v1/celebrity'; // 유명인 인식
   var api_url = 'https://naveropenapi.apigw.ntruss.com/vision/v1/face'; // 얼굴 감지

   var _formData = {
     image:'image',
     image: fs.createReadStream('/Users/naver/MyFaceAnalyzer/public/images/'+arvgStr)
     // FILE 이름
   };
    var _req = request.post({url:api_url, formData:_formData,
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}}).on('response', function(response) {
       console.log(response.data); // 200
       console.log('::: 성별 :::');
    });
    _req.pipe(res); // 브라우저로 출력
 });

 app.listen(3000, function () {
   console.log('::: My FaceAnalyzer app listening on port 3000!');
   app.use(express.static('public'));
 });

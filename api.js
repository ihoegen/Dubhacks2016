var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var verify = require('./dubhacks/verify.js');

var app = express();
app.use(bodyParser());

app.post('/api/image', function (req, res) {
  var timeStamp = new Date().getTime();
  fs.writeFile('public/image' + timeStamp + '.jpg', req.body.data.split(',')[1], 'base64', function() {
    res.send('https://hmivgifcxv.localtunnel.me/image'+ timeStamp+'.jpg');
  });
});

app.post('/api/verify', function (req, res){
  verify(req.body.data, function(data){
    console.log('Sending back ' + data + ' ');
    res.send(data);
  })
});

app.use(express.static('public'));


app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});

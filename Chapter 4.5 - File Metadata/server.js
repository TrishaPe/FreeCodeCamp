var express = require('express');
var cors = require('cors');
require('dotenv').config();
var bodyParser = require('body-parser');
var fileupload = require('express-fileupload');

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use("", bodyParser.urlencoded({extended: false}));
app.use(fileupload());

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', function(req, res){
  res.json({"name":`${req.files.upfile.name}`,"type":`${req.files.upfile.mimetype}`,"size":`${req.files.upfile.size}`});
});

//OUTPUT: {"name":"documentname.ext","type":"application/pdf","size":289326}


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

var express = require('express');
var app = express();
//mount middleware "express.static":
app.use("", express.static(__dirname+"/public"));

//mount middleware bodyparser
var bodyParser = require('body-parser');
app.use("", bodyParser.urlencoded({extended: false}));

//write some middleware for logging
app.use("", function(req, res, next){
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

//respond to 'get' request on root path (="/")
app.get("/", function(req, res){
  res.sendFile(__dirname+"/views/index.html");
});

//send json file as response to 'get' request on path "/json"
app.get("/json", function(req, res){
  if (process.env.MESSAGE_STYLE=="uppercase"){
    res.json({"message": "HELLO JSON"});
  }else{
    res.json({"message": "Hello json"});
  }
});

//use middleware in response to 'get' request
app.get("/now", function(req, res, next){
  req.time=new Date().toString();
  next();
}, function(req, res){
  res.json({"time": `${req.time}`})
});

//echo a word
app.get("/:word/echo", function(req, res){
  res.json({"echo": `${req.params.word}`});
});

//Route the same path to different outcomes based on request type
app.route("/name")
  //Get: use query string in URL
  .get(function(req, res){
    res.json({"name": `${req.query.first} ${req.query.last}`})
  })
  //Post: parse body
  .post(function(req, res){
    res.json({"name": `${req.body.first} ${req.body.last}`})
  });















module.exports = app;

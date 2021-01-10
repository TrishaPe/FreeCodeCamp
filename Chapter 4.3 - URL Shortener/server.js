require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const mongo = require('mongodb');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const nanoid = require('nanoid');
const dns = require('dns');

// Basic Configuration
const port = 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

var websiteSchema = new mongoose.Schema({
  original_url: String,
  short_url: String
});
var Website = mongoose.model('Website', websiteSchema);

app.use("", bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));


//Routes
app.get('/', function(req, res){
  res.sendFile(__dirname + "/views/index.html");
});


const webregex = RegExp('https?:\/\/(www\.)?[a-z\-_\.]+\.[a-z]{2,5}[a-z0-9\-_\/]*');

app.route('/api/shorturl/new')
  .get(function(req, res){
    res.sendFile(__dirname+"/views/index.html");
  })
  .post(function(req, res) {
    const originalURL = req.body.url;
    console.log("POST OriginalUrl = "+originalURL);

    if (webregex.test(originalURL)){
      const urlObject = new URL(originalURL);
      dns.lookup(urlObject.hostname, (err, address, family) => {
        if (err) {
          console.log("Not accepted by dns.lookup");
          res.json({
            original_url: originalURL,
            short_url: "Invalid URL"
          });
        }else{
          console.log("accepted by dns.lookup");
          let shortURL = nanoid.nanoid();
          console.log("Shorturl: "+shortURL);
          // create an object and save it in the DB
          let website = new Website({
            original_url: originalURL,
            short_url: shortURL
          });
        
          website.save((err, data) => {
            if (err) {
              console.error(err);
            }
          });
        
          res.json({
            original_url: originalURL,
            short_url: shortURL
          })
        };
      })
    }else{
      console.log("failed webregex: "+originalURL);
      res.json({"error": "invalid url"});
    }
  });


app.get('/api/shorturl/:short_url?', function(req, res){
  let short=req.params.short_url;
  try {
    console.log("GET Shorturl = "+short);
    Website.findOne({short_url: short}, function (err, website) {
      if (website){
        console.log("Got original url: "+website.original_url);
        return res.redirect(website.original_url);
      }else{
        console.log("Invalid url");
        return res.status(404).json('No URL found');
      }
    });
  }catch{
    console.log(error);
    res.status(500).json('Server error');
  }
});

app.listen(port, function() {
console.log(`Listening on port ${port}`);
});
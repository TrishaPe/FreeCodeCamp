const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.static('public'));
app.use("", bodyParser.urlencoded({extended: false}));


const exerciseSchema = new mongoose.Schema({
  description: String,
  duration: String,
  date: Date
});
const Exercise = mongoose.model('Exercise', exerciseSchema);

const userSchema = new mongoose.Schema({
  username: String,
  exercises: [exerciseSchema]
});
const User = mongoose.model('User', userSchema);

//Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/exercise/new-user', function(req, res){
  console.log("Test New User");
  let userName = req.body.username;
  console.log("POST username: "+userName);
  User.findOne({username: userName}, function(err, data){
    if (data){
      console.log("Duplicate username");
      return res.status(404).json('Username already taken');
    }else{
      let user = new User({
        username: userName,
        exercises: []
      });
      user.save((err, data)=>{
        if (err){
          return console.error(error);
        }else{
          let userId = data._id;
          console.log("User succesfully saved. UserId = "+userId);
          res.json({username: userName, _id: userId});
        }
      });
    }
  });
  console.log("End Test New User");
});

app.get('/api/exercise/users', function(req, res){
  console.log("Test Get Users");
  let users = new Array();

  User.find({})
  .select('username _id')
  .exec(function(error, users) {
    if (error) return console.error(error);
    if (users){
      console.log("Success. Users:"+users);
      res.json(users);
    }else{
      console.log("Error");
      res.status(404).json('Not found');
    }
  });
  console.log("End Test Get Users");
});

app.post('/api/exercise/add', function(req, res){
  console.log("1-Test Add Exercise");
  let userId = req.body.userId;

  User.findById(userId, function(error, user, done){
    if (user){
      let description = req.body.description;
      let duration = req.body.duration;
      let date;
      let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      if (req.body.date){
        givendate = new Date(req.body.date);

        let day = weekdays[givendate.getDay()];
        let month = months[givendate.getMonth()];
        let daynum = ("0" + givendate.getDate()).slice(-2);
        let year = givendate.getFullYear();

        date = day+" "+month+" "+daynum+" "+year;

        console.log("2-Date given: "+date);
      }else{
        let today = new Date();
        let day = weekdays[today.getDay()];
        let month = months[today.getMonth()];
        let daynum = today.getDate();
        let year = today.getFullYear();

        date = day+" "+month+" "+daynum+" "+year;

        console.log("3-No date given, date: "+date);
      }

      user.exercises.push({"description": description, "duration": duration, "date": date});
      if (error) return console.error(error);
      user.save(done);

      res.json({
        _id: userId,
        username: `${user.username}`,
        date: date,
        duration: parseInt(duration),
        description: description
      });

    }else{
      console.error("4-"+error);
      res.status(404).json('User not found');
    }
    console.log("5-End Test Add Exercise");
  });
  // MY OUTPUT: {
  //   "_id":"5ff47b5c359386038df1370e",
  //   "username":"Trisha",
  //   "date":"Tue Jun 30 2020",
  //   "duration":60,
  //   "description":"URL Shortener"
  // }

  // EXAMPLE OUTPUT: {
  //   "_id":"5ff75729c5b5cf05d0805ae4",
  //   "username":"Trisha",
  //   "date":"Tue Jun 30 2020",
  //   "duration":60,
  //   "description":"Exercise Manager"
  // }


});

app.get('/api/exercise/log', function(req, res){
  console.log("Test Exercise Log");
  let userid = req.query.userId;
  let nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  let to;
  if (!req.query.to){
    to=nextYear;
  }else{
    to=new Date(req.query.to);
  }
  let from;
  if (!req.query.from){
    from=new Date(0);
  }else{
    from=new Date(req.query.from);
  }
  let limit = req.query.limit || 100;

  let user = "";
  User.findById(userid, function(error, user){
    if (!user){
      res.json("User not found");
    }else if (user.exercises==""){
      res.json("User has no exercises");
    }else if (error){
      return console.log(error);
      res.json("An error occurred");
    }else{
      //user = userId;

      filteredEx = new Array();
      let count = 0;
      for (let i=0; i<user.exercises.length; i++){
        if (count<limit){
          if (user.exercises[i].date>=from){
            count+=1;
            filteredEx.push(user.exercises[i]);
          }
        }
      }

      res.json({
        "_id":`${userid}`,
        "username":`${user.username}`,
        "count":`${count}`,
        "log":filteredEx
      })
    }
  });

  console.log("End Test Exercise Log");

  //use parameter userId=id (url: "/log?userId=5ff47b5c359386038df1370e")
  //return response: user object with a log array of all exercises added (including exercise properties)
  //"A request to a user's log (/api/exercise/log) returns an object with a count property representing the number of exercises returned."??
  //You can add 'from', 'to' and 'limit' parameters to a /api/exercise/log request to retrieve part of the log of any user. 'from' and 'to' are dates in 'yyyy-mm-dd' format. 'limit' is an integer of how many logs to send back. (GET /api/exercise/log?userId=5ff47b5c359386038df1370e[&from][&to][&limit])
});










const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
})

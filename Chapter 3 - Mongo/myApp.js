require('dotenv').config();
const mongodb = require("mongodb");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//Create a 'Person' Model
var personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favoriteFoods: [String]
});

let Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  let john = new Person({name: "John", age: 20, favoriteFoods: ["Strawberries", "Pasta bolognese"]});
  john.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });

  console.log("performed createAndSavePerson");
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function(err, data){
    if (err) return console.error(err);
    done(null, data);
  });

  console.log("performed createManyPeople");
};


const findPeopleByName = (personName, done) => {
  Person.find({name: `${personName}` }, function(err, data){
    if (err) return console.error(err);
    done(null, data);
  });

  console.log("performed findPeopleByName");
};

const food = "Strawberries";
const findOneByFood = (food, done) => {
  Person.findOne( {favoriteFoods: `${food}` }, function(err, data){
    if (err) return console.error(err);
    done(null, data);
  });

  console.log("performed findOneByFood");
};

const findPersonById = (personId, done) => {
  Person.findById(personId, function(err, data){
    if (err) return console.error(err);
    done(null, data);
  })

  console.log("performed findPersonById");
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, function(err, data){
    data.favoriteFoods.push(foodToAdd);
    if (err) return console.error(err);
    data.save(done);
  });

  console.log("performed findEditThenSave");
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({name: `${personName}`}, {age: `${ageToSet}`}, { new: true }, done);

  console.log("performed findAndUpdate");
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, done);

  console.log("performed removeById");
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.deleteMany({name: `${nameToRemove}`}, done);

  console.log("performed removeManyPeople");
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({ favoriteFoods: foodToSearch })
  .sort({ name: 1 })
  .limit(2)
  .select({ age: 0 })
  .exec(function(error, people) {
    if (error) return console.error(error);
    done(null, people);
  });
  console.log("executed queryChain")

};


/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;

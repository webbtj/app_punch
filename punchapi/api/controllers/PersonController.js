/**
 * Created by rob on 14-12-16.
 */
var q = require('q');

module.exports = {
  arrive: function (req, res) {
    return Person.findOne({
      name:req.body.name
    })
    .then(function(person) {
      return Arrivals.create({
        person_id: person.id,
        timestamp: Date.now()
      })
      .then(function(arrival) {
        return person
      })
    })
    .then(function(person) {
      console.log(person.name + ' has arrived.');
      return res.send(200);
    })
    .catch(function(err) {
      console.log(err);
      return res.send(err);
    })

  },

  depart: function (req, res) {

    return Person.findOne({
      name:req.body.name
    })
    .then(function(person) {
      return Departures.create({
        person_id: person.id,
        timestamp: Date.now()
      })
      .then(function(departure) {
        return person
      })
    })
    .then(function(person) {
      console.log(person.name + ' has left.');
      return res.send(200);
    })
    .catch(function(err) {
      console.log(err);
      return res.send(err);
    })
  }
};

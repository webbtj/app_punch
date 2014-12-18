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
      return Person.update({
        id:person.id
      }, {
        active: true
      })
      .then(function(person) {
        return person[0]
      })
    })
    .then(function(person) {
      var timeStamp = Date.now();
      var date = new Date(timeStamp);
      return Arrivals.create({
        person_id: person.id,
        time: Date.now(),
        day: date.getDay()
      })
      .then(function(arrival) {
        return person
      })
    })
    .then(function(person) {
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
      return Person.update({
        id:person.id
      }, {
        active: false
      })
      .then(function(person) {
        return person[0]
      })
    })
    .then(function(person) {
        var timeStamp = Date.now();
        var date = new Date(timeStamp);
        return Departures.create({
          person_id: person.id,
          time: Date.now(),
          day: date.getDay()
        })
      .then(function(departure) {
        return person
      })
    })
    .then(function(person) {
      return res.send(200);
    })
    .catch(function(err) {
      console.log(err);
      return res.send(err);
    })
  },

  orderList: function (req, res) {
    return Person.find()
      .then(function(people) {
        //todo determine the best order for people arriving and leaving.
        console.log('List order updated.');
        return res.send(people);
      });
  }

};

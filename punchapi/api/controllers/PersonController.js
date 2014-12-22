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
      .sort({ arrival_time: 'asc' })
      .then(function(people) {
        var orderedList = [];
        var currentTime = Date.now();
        var temp = 0;
        //find the difference between stored and current time
        for(var i = 0; i < people.length; i++) {
          if(people[i].active == false) {
            temp = currentTime - people[i].arrival_time;
          } else {
            temp = currentTime - people[i].departure_time;
          }
          //make time difference positive
          if(temp < 0) {
            temp = temp * -1;
          }
          people[i].difference = temp;
        }
        //sort the people by their positive difference from the current time
        people.sort(function(a,b) { return parseFloat(a.difference) - parseFloat(b.difference) } );
        //todo determine the best order for people arriving and leaving.
        console.log('List order updated.');
        return res.send(people);
      })
      .catch(function(err) {
        console.log(err);
        return res.send(err);
      })
  }

};

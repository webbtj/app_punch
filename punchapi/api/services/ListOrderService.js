/**
 * Created by rob on 14-12-18.
 */
var q = require('q');
//update all users with new arrival and departure times
exports.calcArrivals = function(cb) {
  return Person.find({})
    .then(function(people) {
      var promises = [];
      var calcArrival = function(person) {
        var day = new Date(Date.now()).getDay();
        var deferred = q.defer();
        Arrivals.find({
          person_id: person.id,
          day: day
        }, function(err, arrivals) {
          if((err)) {
            console.log(err);
            deferred.reject(500);
          } else {
            ListOrderService.doStatistics(arrivals, person.id, deferred, "arrival");
          }
          return deferred.promise;
        });
      };

      for(var i = 0; i < people.length; i++) {
        promises.push(calcArrival(people[i]));
      }

      return q.allSettled(promises)
        .then(function(results) {
          return people;
        });
    })
    .then(function(people) {
      var promises = [];
      var calcDeparture = function(person) {
        var day = new Date(Date.now()).getDay();
        var deferred = q.defer();
        Departures.find({
          person_id: person.id,
          day: day
        }, function(err, departures) {
          if((err)) {
            console.log(err);
            deferred.reject(500);
          } else {
            ListOrderService.doStatistics(departures, person.id, deferred, "departure");
          }
          return deferred.promise;
        });
      };

      for(var i = 0; i < people.length; i++) {
        promises.push(calcDeparture(people[i]));
      }

      return q.allSettled(promises)
        .then(function(results) {
          return cb(null, results);
        });
    })
    .catch(function(err) {
      console.log(err);
      return cb(500, null);
    })
}

exports.doStatistics = function(times, person_id, deferred, type) {
  if (times.length == 0) {
    if(type === "arrival") {
      var arrivalDate = new Date(Date.now());
      var arrivalTime = new Date(arrivalDate.getFullYear()+
        ' '+(arrivalDate.getMonth()+1)+
        ' '+arrivalDate.getDate()+',09:00:00');//set to 9am
      var options = {
        arrival_time: arrivalTime.valueOf()
      };  
    } else if (type === "departure") {
      var departureDate = new Date(Date.now());
      var departureTime = new Date(departureDate.getFullYear()+
        ' '+(departureDate.getMonth()+1)+
        ' '+departureDate.getDate()+',17:00:00'); //set to 5:00pm
      var options = {
        departure_time: departureTime.valueOf()
      };
    }
    Person.update({
      id:person_id
    },
    options
    , function(err, person) {
      if((err)) {
        console.log(err);
        deferred.resolve(500);
      } else if (!(person)) {
        console.log('Something went wrong finding a person.');
        deferred.resolve(400)
      } else {
        deferred.resolve(200);
      }
    });
  } else {
    var averageTime = ListOrderService.doMath(times);
    if(type === "arrival") {
      var options = {
        arrival_time: averageTime
      }
    } else if (type === "departure") {
      var options = {
        departure_time: averageTime
      }
    }
    Person.update({
      id:person_id
    },
      options
    , function(err, person) {
      if((err)) {
        console.log(err);
        deferred.resolve(500);
      } else if (!(person)) {
        console.log('Something went wrong finding a person.');
        deferred.resolve(400)
      } else {
        deferred.resolve(200);
      }
    });
  }
}

exports.doMath = function(times) {
  // Remove outliers
  times = ListOrderService.filterOutliers(times);
  var totalTime = 0;

  // Calculate average of remaining values
  for(var i = 0; i<times.length; i++) {
    totalTime = totalTime + parseInt(times[i].time)
  }
  return totalTime/times.length;
}

exports.filterOutliers = function(times) { 
  var values = times.concat();
  // Sort values lowest to largest
  values.sort( function(a, b) {
    return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0);
  });

  // Determine bounds
  var q1 = values[Math.floor((values.length / 4))].time; 
  var q3 = values[Math.floor((values.length * (3 / 4)))].time;

  // Then filter anything beyond or beneath these values.
  var filteredValues = values.filter(function(x) {
    return (x.time >= q1) && (x.time <= q3);
  });

  return filteredValues;
} 
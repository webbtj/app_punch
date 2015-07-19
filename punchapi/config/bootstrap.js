/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  var cronJob = require('cron').CronJob;
  //cron job runs each day at 6am
  //var calculateArrivals = new cronJob('00 * * * * *', function(){
  var calculateArrivals = new cronJob('00 00 6 * * *', function(){
    try {
      ListOrderService.calcArrivals(function(err, data) {
        if((err)) {
          console.log(err);
        } else if (!(data)) {
          console.log('No data returned from arrivals list')
        } else {
          console.log('Updated users arrival/departure times successfully.');
        }
      });
    }catch(ex) {
      sails.log.error(ex);
      done();
    }
  });
  calculateArrivals.start();
  cb();
};

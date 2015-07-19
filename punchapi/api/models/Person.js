/**
 * Created by rob on 14-12-16.
 */
module.exports = {

  attributes: {
    arrival_time: {
      type: 'STRING'
    },
    departure_time: {
      type: 'STRING'
    },
    name: {
      type: 'STRING',
      required: true
    },
    active: {
      type: 'BOOLEAN'
    }
  }
};

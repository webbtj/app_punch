/**
 * Created by rob on 14-12-16.
 */
module.exports = {
  arrive: function (req, res) {
    console.log('arrive');
    return res.send(200);
  },

  depart: function (req, res) {
    console.log('depart');
    return res.send(200);
  }
};

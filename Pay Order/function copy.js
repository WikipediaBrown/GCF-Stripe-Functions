
const stripe = require("stripe")("<YOUR PRIVATE KEY HERE>");
var Datastore = require('@google-cloud/datastore');
var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "<YOUR PROJECT ID HERE>",
    clientEmail: "<YOUR SERVICE ACCOUNT EMAIL HERE>",
    privateKey: "<YOUR PROJECT ID HERE>"
  }),
  databaseURL: "<YOUR DATABASE URL HERE>"
});

const datastore = Datastore({
    projectId: "<YOUR PROJECT ID HERE>"
});

exports.payOrder = function payOrder(req, res) {

    var idToken = req.body.idToken;
    var orderID = req.body.orderID;

    admin.auth().verifyIdToken(idToken).then(function(decodedToken) {

      const userKey = datastore.key(['user', decodedToken.uid]);

      datastore.get(userKey).then((results) => {
        if (typeof results[0] === 'undefined') {
          Promise.reject(error)
        } else {
          return Promise.resolve(results[0].customerID)
        }
      }).then(function(customerID) {

          stripe.orders.pay(orderID, {
            customer: customerID
          }).then(function(paidOrder) {
            res.send('Order paid.' + paidOrder);
          }).catch(function(error) {
            res.send('Could not pay order.' + error);
          });

      }).catch(function(error) {
        res.send('User does not have account')
      });

  }).catch(function(error) {
        res.send('Nigga, you aint real...')
  });
};


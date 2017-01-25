
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

exports.updatePrimaryCard = function updatePrimaryCard(req, res) {

      var idToken = req.body.idToken;

    admin.auth().verifyIdToken(idToken).then(function(decodedToken) {

      const userKey = datastore.key(['user', decodedToken.uid]);

      datastore.get(userKey).then((results) => {
        if (typeof results[0] === 'undefined') {
          Promise.reject(error)
        } else {
          return Promise.resolve(results[0].customerID)
        }
      }).then(function(customerID) {

        var card = req.body.card;

        stripe.customers.update(customerID, {
          source: card,
        }, function(err, customer) {
          // asynchronously called
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            res.send(customer)
          }
        });

    }).catch(function() {
        console.log('There was an error')
        res.send('User does not have an account')
    });


  }).catch(function(error) {
        res.send('Nigga, you aint real...')
  });
};


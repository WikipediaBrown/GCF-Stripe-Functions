
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

exports.createCustomer = function createCustomer(req, res) {

  var idToken = req.body.idToken;

    admin.auth().verifyIdToken(idToken).then(function(decodedToken) {

      const userKey = datastore.key(['user', decodedToken.uid]);

      datastore.get(userKey).then((results) => {
        if (typeof results[0] === 'undefined') {
          return Promise.resolve(results)
        } else {
          Promise.reject(error)
        }
      }).then(function(results) {

        stripe.customers.create({
          description: decodedToken.uid,
        }, function(err, customer) {

          if (err == null) {
            const entity = {
                key: userKey,
                data: {
                  customerID: customer.id
                }
            };
            datastore.upsert(entity).then(() => {
              res.send(customer.id);
            }).catch(function(error) {
              res.send('Error saving user. Please try again.' + error);
            });

          } else {
              res.send('Error creating user. Please try again.' + err);
          }

        });

    }).catch(function() {
        res.send('User already has account')
    });


  }).catch(function(error) {
        res.send('Hey, who are you?')
  });
};


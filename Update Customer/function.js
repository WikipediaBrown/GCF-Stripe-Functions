
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

exports.updateCustomer = function updateCustomer(req, res) {

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

        var shipping = req.body.shipping
        var metadata = req.body.metadata;
        var email = req.body.email;

        stripe.customers.update(customerID, {
          metadata: metadata,
          email: email,
          shipping: req.body.shipping
        }, function(err, customer) {
          // asynchronously called
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            var customerObject = {};

            if (customer.shipping !== null) {
                  customerObject['name'] = customer.shipping.name
            }
            if (customer.shipping != null) {
                  customerObject['line1'] = customer.shipping.line1
            }
            if (customer.shipping != null) {
                  customerObject['line2'] = customer.shipping.line2
            }
            if (customer.shipping != null) {
                  customerObject['city'] = customer.shipping.city
            }
            if (customer.shipping != null) {
                  customerObject['postalCode'] = customer.shipping.postal_code
            }
            if (customer.shipping != null) {
                  customerObject['state'] = customer.shipping.state
            }
            if (customer.shipping != null) {
                  customerObject['country'] = customer.shipping.country
            }
            if (customer.shipping != null) {
                  customerObject['phone'] = customer.shipping.phone
            }
            if (customer.email != null) {
                  customerObject['email'] = customer.email
            }
            console.log(customerObject)
            res.json(customerObject)
          }
        });

    }).catch(function() {
        console.log('There was an error')
        res.send('User does not have an account')
    });


  }).catch(function(error) {
        res.send('Hey, who are you?')
  });
};


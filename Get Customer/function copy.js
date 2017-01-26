
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

exports.getCustomer = function getCustomer(req, res) {

    var idToken = req.body.idToken;

    admin.auth().verifyIdToken(idToken).then(function(decodedToken) {

      const userKey = datastore.key(['user', decodedToken.uid]);

      datastore.get(userKey).then((results) => {

        if (typeof results[0] === 'undefined') {
          return Promise.resolve(results)
        } else {
          return Promise.reject(results[0].customerID)
        }

      }).then(function(results) {
        
        stripe.customers.create({
          description: decodedToken.uid,
        }).then(function(customer) {

            const entity = {
                key: userKey,
                data: {
                  customerID: customer.id
                }
            };

            datastore.upsert(entity).then(() => {
              res.json({"message": "Customer created & saved but has no data."})
            }).catch(function(error) {
                res.json({"message": "Error saving user. Please try again." + error});
            });

        }).catch(function(error) {
            res.json("message": "Error creating user. Please try again." + err);
        });

    }).catch(function(customerID) {
      console.log(customerID)
      stripe.customers.retrieve(customerID).then(function(customer) {

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
        }).catch(function(error) {
          console.log(error)
            res.json('User does not have a Stripe account')
        });

    });

  }).catch(function(error) {
        res.send('Nigga, you aint real...')
  });
};


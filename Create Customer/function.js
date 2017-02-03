
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

var idToken = req.body.idToken

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
          var customerObject = {};
          if (customer.shipping !== null) {
            customerObject['name'] = customer.shipping.name
            customerObject['phone'] = customer.shipping.phone
          }
          if (customer.shipping !== null && customer.shipping.address !== null) {
            customerObject['name'] = customer.shipping.name
            customerObject['line1'] = customer.shipping.address.line1
            customerObject['line2'] = customer.shipping.address.line2
            customerObject['city'] = customer.shipping.address.city
            customerObject['postalCode'] = customer.shipping.address.postal_code
            customerObject['state'] = customer.shipping.address.state
            customerObject['country'] = customer.shipping.address.country
          }
          customerObject['email'] = customer.email
          res.json(customerObject)
        }).catch(function(error) {
          res.send('Error saving user. Please try again.' + error);
        });

      }).catch(function(error) {
        res.send('Error creating user. Please try again.' + err);
      });

    }).catch(function(customerID) {

      stripe.customers.retrieve(customerID).then(function(customer) {
        var customerObject = {};

        if (customer.shipping !== null) {
          customerObject['name'] = customer.shipping.name
          customerObject['phone'] = customer.shipping.phone
        }
        if (customer.shipping !== null && customer.shipping.address !== null) {
          customerObject['name'] = customer.shipping.name
          customerObject['line1'] = customer.shipping.address.line1
          customerObject['line2'] = customer.shipping.address.line2
          customerObject['city'] = customer.shipping.address.city
          customerObject['postalCode'] = customer.shipping.address.postal_code
          customerObject['state'] = customer.shipping.address.state
          customerObject['country'] = customer.shipping.address.country
        }
        customerObject['email'] = customer.email
        res.json(customerObject)
      }).catch(function(error) {
        res.send('User does not have a Stripe account'+error)
      });
    });

  }).catch(function(error) {
    res.send('Nigga, you aint real...')
  });
};


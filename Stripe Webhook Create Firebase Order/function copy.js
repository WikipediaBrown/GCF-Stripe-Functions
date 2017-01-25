
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

var db = admin.database();
var ref = db.ref()

exports.createSeptemberOrder = function createSeptemberOrder(req, res) {
  stripe.events.retrieve(req.body.id, function(err, event) {
    if (event.data.object.object == 'order') {
      stripe.customers.retrieve(event.data.object.customer).then(function(customer) {
        ref.child('orders').child(customer.description).child(event.data.object.id).update(event.data)
      });
    }
  });
};


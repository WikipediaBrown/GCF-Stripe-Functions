// [START app]
'use strict';

const stripe = require("stripe")("<YOUR PRIVATE KEY HERE>");
var Datastore = require('@google-cloud/datastore');
var admin = require('firebase-admin');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/test', function(req, res, next) {

	var idToken = req.body.idToken;
  var orderItems = req.body.items;


  admin.auth().verifyIdToken(idToken).then(function(decodedToken) {
    console.log('Stage 1');
    const userKey = datastore.key(['user', decodedToken.uid]);

    datastore.get(userKey).then((results) => {

      if (typeof results[0] === 'undefined') {
        Promise.reject(error)
      } else {
        console.log('Stage 2');
        return Promise.resolve(results[0].customerID)
      }

    }).then(function(customerID) {
      console.log('Stage 3');

    }).then(function() {
      console.log('Stage 4');

    }).then(function() {
      console.log('Stage 5');

    }).then(function() {
      console.log('Stage 6');

    }).catch(function() {
      console.log('User already has account')
      res.send('User already has account')
    });


  }).catch(function(error) {
      res.send('Nigga, you aint real...')
  });
});


// Start the server
var server = app.listen(process.env.PORT || '8080', function () {
    console.log('App listening on port %s', server.address().port);
    console.log('Press Ctrl+C to quit.');
});
// [END app]


Google Cloud Functions for Stripe & Firebase

GCF Stripe Functions is a collection of Google Cloud functions (Cloud functions run on Node.js). These functions interact with the Stripe API via the Stripe NPM module. All interactions with the functions are authenticated or validated. In the case of client facing functions, all interactions are authenticated via secure token. The functions use encrypted tokens to authenticate all interactions, then they exchange the user ID obtained from the decoded token to obtain a Stripe customer ID from Google Cloud Datastore. Data store with Cloud Datastore is encrypted at rest and in transit. Some of the functions help to add required data to a customer record in order to allow charges using just a customer record which in turn is stored for the user and is only retrievable with a valid authentication token.

Why?

I wanted to create a serverless framework for Stripe that's secure and easy to use. 

Support

For questions, email info@iamgoodbad.com

License 

MIT LICENSE Copyright © 2017 info@iamgoodbad.com

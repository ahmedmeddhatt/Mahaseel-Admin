/**
 * loading files and modules
 */
 const functions = require("firebase-functions");
 const mongoose = require('mongoose');
 const express = require('express');
 const bodyParser = require('body-parser');
 
 const cors = require('cors');
 
 /**
  * impoort middlewares
  */
 const { verify} = require('./middlewares/auth.middleware')
 const Routes = require('./routes/index');
 
 require('dotenv').config();
 /**
  * Connect To DB 
  * You can connect to MongoDB with the mongoose.connect() method.
  */
 
  mongoose.Promise = global.Promise;
  let isConnected;
 
 connectToDatabase = () => {
    if (isConnected) {
      console.log('DB: using existing database connection');
      return Promise.resolve();
    }
    console.log('DB: using new database connection');
    return mongoose.connect(process.env.MongoDB)
      .then(db => { 
        isConnected = db.connections[0].readyState;
      });
 };
 
 connectToDatabase()
 /**
  * configuer app and middelwares 
  */
 const app = express();
 app.use(bodyParser.json())
 
 app.use(cors({ origin: true }))
 
 // Our Auth handler Bear Token JWT
 app.use(verify);
 
 /**
  * define routes for our app
  */
 
 app.use('/user'  , Routes.user);
 app.use('/quality'  , Routes.quality);
 app.use('/crop'  , Routes.crop);
 app.use('/location'  , Routes.location);
 app.use('/request'  , Routes.request);
 app.use('/cert'  , Routes.cert);
 app.use('/dashboard'  , Routes.dashboard);
 app.use('/newsletter'  , Routes.newsletter);
 app.use('/topics'  , Routes.topics);
 app.use('/posts'  , Routes.posts);
 app.use('/media'  , Routes.media);
 
 app.get('/', (req, res) => {
    res.send("Admin is Running ..")
 });
 
 app.get('/test', require('./controllers/test.controller').run);
 
 exports.admin = functions.https.onRequest(app);
 
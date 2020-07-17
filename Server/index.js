const express = require('express');
var cors = require("cors");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// set up express app
const app = express();
app.use(cors());

// connect to mongodb
mongoose.connect('mongodb://localhost/NewClass', { useNewUrlParser: true,useUnifiedTopology: true  } );
mongoose.Promise = global.Promise;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize routes
app.use('/', require('./routes/api'));

// error handling middleware
app.use(function(err, req, res, next){
    console.log(err); // to see properties of message in our console
    res.status(422).send({error: err.message});
});

// listen for requests
app.listen(4000, function(){
    console.log('servernow listening for requests at 4000');
});

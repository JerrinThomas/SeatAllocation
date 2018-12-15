var express = require('express'); //creation of object for internal module 'express'
//var ejs = require('ejs')
var mongoose = require('mongoose'); //creation of object for internal module 'mongoose'
var bodyParser = require('body-parser'); //creation of object for internal module 'body-parser'
var Routes = require('./routes/main')
var session = require('client-sessions');

var app = express(); //Creates an Express application

mongoose.connect('mongodb://localhost:27017/seatAllocDB')
app.use(session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
  }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(Routes)
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));



app.listen(8080, function () {
    console.log('Node.js listening on port ' + 8080)

})
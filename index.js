var mongo = require('mongodb');
const express = require('express');
// const socket = require("socket.io");
const jwt = require('jsonwebtoken');
var app = require('express')();
const fs = require('fs');
var http = require('http').Server(app);
const https = require('https');
const port = 8008;
const db = require('./server/mongodb');
const bodyParser = require('body-parser');
const verify = require('./server/verifyToken');
var ip = require('ip');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const { nextTick } = require('process');
// global.io = socket(http);
const nodemailer = require('./server/config/nodemailer.config');
const { pass } = require('./server/config/auth.config');

const options = {
  key: fs.readFileSync('certs/private.key'),
  cert: fs.readFileSync('certs/certificate.crt'),
  passphrase: process.env.CERT
};

app.use(express.static("js"));
app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/'));

app.use("/utilities", express.static('./utilities/'));
app.use(cookieParser());

//GET METHOD
app.get('/', (req, res) => {
  const token = req.cookies["session"];
  var status_code = verify(token);
  if (status_code == 200) {
    res.redirect('/videoroom');
  } else {
    console.log('[REGISTER] ' + Date.now() + ' - GET - ' + req.hostname);
    res.sendFile(__dirname + '/client/iscriviti.html');
  }
});

app.get('/login', (req, res) => {
  const token = req.cookies["session"];
  var status_code = verify(token);
  if (status_code == 200) {
    res.redirect('/videoroom');
  } else {
    console.log('[LOGIN] ' + Date.now() + ' - GET - ' + req.hostname);
    res.sendFile(__dirname + '/client/login.html');
  }
});

/*
app.get('/verifyTkn', verify, (request, response)=>{
  console.log('[VERYFING TOKEN] -' + Date.now() + ' - GET request - ' + request.hostname);
  response.status(200).end();
});
*/

app.get('/confirm', (request, response) =>{
  console.log('[CONFIRM] ' + Date.now() + ' - GET - ' + request.hostname);
  db.confirmEmail(request.query.email, _=>{
    response.redirect("./emailConfirmation.html");
  });
});

app.get('/videoroom', (req, res) => {
  const token = req.cookies["session"];
  // console.log('[DEBUG] Token: ' + token);
  var status_code = verify(token);
  if (status_code == 200) {
    console.log('[VIDEOROOM] ' + Date.now() + ' - GET - ' + req.hostname);
    res.sendFile(__dirname + '/client/videoroom.html');
  } else {
    var room = req.query.room;
    if (room !== undefined) {
      res.redirect('/login?room=' + room);
    } else {
      res.redirect('/login');
    }
  }
});

app.get("/logout", (req, res) => {
  console.log('[LOGOUT] ' + Date.now() + '- GET - ' + req.hostname);
  res.clearCookie('session');
  res.redirect('/login');
});

//POST METHOD
app.post('/register', (request, response) => {
  console.log('[REGISTER] ' + Date.now() + ' - POST - ' + request.hostname);
  db.insertUser(request.body, res => {
      if(res) response.status(200).end();
      else response.status(409).end();
     
    });
});

app.post('/login', (request, response) => {
  console.log('[LOGIN] ' + Date.now() + ' - POST - ' + request.hostname);
  db.login(request.body, (token, res, status) => {
    switch (status){
      case 200:
        response.status(status);
        response.cookie('session', token);
        if(request.body.room === "") {
          response.redirect('/videoroom');
        } else {
          response.redirect('/videoroom?room=' + request.body.room);
        }
        break;
      default:
        response.status(status).end();
    }
  });
});

app.post('/invite', (request, response) => {
  console.log('[INVITE] ' + Date.now() + ' - POST - ' + request.hostname);
  // console.log('[DEBUG] Email: ' + request.body.email + ' Room: ' + request.body.room);

  nodemailer.sendInviteEmail(request.body.email, request.body.room);
  return true;
  });


// Server
const server = https.createServer(options, app);

server.listen(port, () => {
  console.log('[SERVER] Listening on https://' + ip.address() + ':' + port);
});

// app.post('/autenticazione', function(req, res) {
    // const username = req.body.name;
    // const pass= req.body.passowrd;
   

    //   inserUser({ username,pass }, function(err,user){
    //   if (err) {  return next(err) }
    //          else {  return res.sendFile(__dirname + '/client/videoroomtest.html');; }
    //          })
    //         })
      
//         var userData = {  username: req.body.username, password: req.body.password } 
//         //use schema.create to insert data into the db 
//        model.create(userData, function (err, user) { 
//             if (err) {  return next(err) }
//              else {  return res.redirect('/videoroomtest'); }
//              })
//          }}
// )   
      // Capture the input fields
       
    //     let username = request.body.username;
    //     let password = request.body.password;
    //     // Ensure the input fields exists and are not empty
    //     if (username && password) {
    //         // Execute SQL query that'll select the account from the database based on the specified username and password
    //         connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
    //             // If there is an issue with the query, output the error
    //             if (error) throw error;
    //             // If the account exists
    //             if (results.length > 0) {
    //                 // Authenticate the user
    //                 request.session.loggedin = true;
    //                 request.session.username = username;
    //                 // Redirect to home page
    //                 response.redirect('/videoroomtest');
    //             } else {
    //                 response.send('Incorrect Username and/or Password!');
    //             }			
    //             response.end();
    //         });
    //     } else {
    //         response.send('Please enter Username and Password!');
    //         response.end();
    //     }
    // });
  

//{res.sendFile(__dirname + '/autenticazione.html');})
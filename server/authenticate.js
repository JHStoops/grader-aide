const express = require('express');
const app = express();
const config = require('./config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const router = express.Router();

app.set('secretKey', config.secret);

router.route('/')
    .post(authenticate);

router.route('/register')
    .post(register);

function authenticate(req, res){
    db.getData('users', {"username": req.body.username})
        .then(function(users){
              let user = users[0];
              if (!user) {
                  res.json({ success: false, message: 'User or password incorrect.' });
              } else if (user) {
                  if (bcrypt.compareSync(req.body.password, user.password)) {
                      var token = createJWTToken({
                          username: user.username,
                          grader: user.grader
                      });
                      // set a custom header with the token in it so that we can also redirect
                      res.json({
                          success: true,
                          name: user.first,
                          ta: user.grader,
                          token: token
                      });
                  } else {
                      res.status(401).send({auth: false, token: null});
                  }
              }
        })
        .catch(err => res.sendStatus(400));
}

// Registering user
function register(req, res) {
    // Server side validation
    let errors = [];
    if (!req.body.first) errors.push("First name required");
    if (!req.body.last) errors.push("Last name required");
    if (!req.body.username) errors.push("Username required");
    if (!req.body.password) errors.push("Password required");
    // Check for usernames already in use
    if (req.body.username) {
        db.getData('users', {"username": req.body.username})
            .then(function(users){
                if (users.length > 0) {
                    errors.push("Username already in use");
                }
                if (errors.length > 0) {
                    res.status(400).send({
                        success: false,
                        errors: errors
                    });
                } else {
                    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
                    db.insertData('users', {
                        "username": req.body.username,
                        "password": hashedPassword,
                        "grader": req.body.grader,
                        "first": req.body.first,
                        "last": req.body.last
                    });
                    // create a token
                    var token = createJWTToken({
                        username: req.body.username,
                        grader: req.body.grader
                    });
                    res.status(200).send({
                        success: true,
                        name: req.body.first,
                        token: token
                    });
                }
            });
    }
}

function createJWTToken(payload) {
    // JWT is pretty rad: https://scotch.io/bar-talk/the-ins-and-outs-of-token-based-authentication
    return jwt.sign(payload, app.get('secretKey'), {
        expiresIn: 86400 // expires in 24 hours
    });
}

module.exports = router;

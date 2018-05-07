const jwt = require('jsonwebtoken');
const config = require('./config');

function verifyToken(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        // this adds the 'grader role' and username to the request object for future use by other parts of app
        req.username = decoded.username;
        req.grader = decoded.grader;
        next(); // key function for middleware
    });
}
module.exports = verifyToken;

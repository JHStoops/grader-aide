console.log('\nLoading Server');

// load modules
const express = require('express');
const logger = require('morgan');
const compression = require('compression');
const favicon = require('serve-favicon');
const history = require('connect-history-api-fallback');  //required for client-side routing
const path = require('path');
const helmet = require('helmet');
const app = express();
const courses = require('./courses.js');
const assignments = require('./assignments.js');
const authenticate = require('./authenticate.js');
const staticFiles = require('./staticFiles.js');
const db = require('./db');

const port = process.env.PORT || 8080;
//const port = process.env.PORT || 80;
const webRoot = __dirname.replace('server', 'public');
const dist = __dirname.replace('server', 'dist');

// express middleware
app.use(logger('dev'));
app.use(favicon(path.join(webRoot, 'favicon.ico')));
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({extended: false})); //application/x-www-form-urlencoded
app.use(express.json());                        //application/json
app.use(history());

//CORS related code -- need it while running webpack and the node server on separate ports
const cors = require('cors');
const corsOptions = {
  origin: ['http://grader-aide.fun', 'http://localhost:8080','*'],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Origin, x-access-token, x-authorization, X-Requested-With, Content-Type, Accept'
};
app.use(['/public/*', '/dist/*', '/api/v1/*'], cors(corsOptions));
app.use( (req, res, next) => {
  req.url = req.originalUrl;
  next();
});

//End of CORS related code (Required for webpack environment)

//Server-side routing
app.use('/api/v1/courses', courses);
app.use('/api/v1/courses', assignments);    // Listens for /:courseId/assignments/* path
app.use('/api/v1/authenticate', authenticate);
app.use('/public', staticFiles);
app.use('/dist', staticFiles);

// routing on client-side requires index.html to be served for everything
app.get('*', function(req, res) {
  res.status(200).sendFile(webRoot + '/index.html');
});

// Start Server
const server = app.listen(port, null, null, () => console.log(`\nServer listening on port: ${port}`));

function gracefulShutdown() {
  console.log('\nStarting Shutdown');
  db.close();
  server.close(() => console.log('\nShutdown Complete'));
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = app;

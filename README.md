# Grader-Aide


#### Pre-requisites

Ensure you have NodeJS installed:
[https://nodejs.org/en/](https://nodejs.org/en/ "NodeJS")

You must have a MongoDB instance up and running that the server connects to.
You can download MongoDB here: [https://docs.mongodb.com/getting-started](https://docs.mongodb.com/getting-started/shell/tutorial/install-mongodb-on-windows/ "MongoDB")
#### Getting Started

First change these lines of code in **db.js** (near the top of the file) to match the database name, ip, and port of your specific MongoDB instance:

```
const dbName = 'graderaide-db';

const ip = '127.0.0.1';

const port = 27017;
```


Install required NPM modules

```npm install```

Build the project with webpack

```npm run build```

Spin up the node server

```npm run api```

***
#### Acknowledgements
Grader-Aide is crafted with love by the following individuals:

*Travis Lindsay, Joseph Stoops, Tanner Mcallister, Bob Mcann*
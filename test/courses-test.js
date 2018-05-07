/* global fetch */
require('../spikes/resetDbData.js');    //Populate test db with data from public/Courses.json
const request = require('supertest');
const should = require('chai').should();
const app = require('../server/app.js');

let jwtToken = {};
const agent = request.agent(app);

describe('Grab a jwtToken', function () {
  it('should be authenticated as test-db', function (done) {
    const creds = {'username': 'test-db', 'password': 'test-db'};
    agent.post('/api/v1/authenticate')
      .send(creds)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        jwtToken.token = res.body.token;
        jwtToken.ta = res.body.ta;

        jwtToken.should.not.equal(null);
        jwtToken.should.be.an('Object');
        jwtToken.should.have.property('token');
        jwtToken.should.have.property('ta');

        done();
      });
  });
});

describe('Courses REST', function () {

  it('should GET all courses', function (done) {
    agent.get('/api/v1/courses')
      .set({
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-access-token': jwtToken.token
      })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        const courses = res.body;

        courses.should.not.equal(null);
        courses[0].name.should.equal("CS4690 - Web III");
        courses[1].name.should.equal("CS3660 - Web II");
        courses[0].assignments[1].rules.should.have.length(5);

        done();
      });
  });

  it('should GET a single course');   //not used by app yet

  it('should CREATE a course', function (done) {
    agent.post('/api/v1/courses')
      .set({
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-access-token': jwtToken.token
      })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        const data = res.body;

        data.should.have.property('success');
        data.should.have.property('id');
        data.success.should.equal(true);
        data.id.should.not.equal(null);

        done();
      });
  });

  it('should CHANGE a single course', function (done) {
    agent.get('/api/v1/courses')
      .set({
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-access-token': jwtToken.token
      })
      .end(function (err, res) {
        if (err) return done(err);
        const courses = res.body;
        courses[1].assignments.pop();

        agent.put(`/api/v1/courses/${courses[1].id}`)
          .send(courses[1])
          .set({
            'accept': 'application/json',
            'content-type': 'application/json',
            'x-access-token': jwtToken.token
          })
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);

            courses[1].name.should.be.a('string');
            courses[1].assignments[0].name.should.be.equal('4D');

            done();
          });
      });
  });

  it('should DELETE a single course', function (done) {
    agent.get('/api/v1/courses')
      .set({
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-access-token': jwtToken.token
      })
      .end(function (err, res) {
        if (err) return done(err);
        const coursesInit = res.body;
        const name = coursesInit.name;

        agent.delete(`/api/v1/courses/${coursesInit[1].id}`)
          .set({
            'accept': 'application/json',
            'content-type': 'application/json',
            'x-access-token': jwtToken.token
          })
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            agent.get('/api/v1/courses')
              .set({
                'accept': 'application/json',
                'content-type': 'application/json',
                'x-access-token': jwtToken.token
              })
              .end(function (err, res) {
                if (err) return done(err);
                const courses = res.body;

                courses.should.have.length(coursesInit.length - 1);
                done();
              });
          });
      });
  });
});

// mocha/chai example
// https://mochajs.org/
// http://www.chaijs.com/api/bdd/

// supertest example
// https://www.npmjs.com/package/supertest

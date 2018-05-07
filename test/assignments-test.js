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

describe('Assignments REST', function () {

  it('should GET all assignments', function (done) {
    agent.get('/api/v1/courses')
      .set({
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-access-token': jwtToken.token
      })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        const course = res.body[0];

        agent.get(`/api/v1/courses/${course.id}/assignments`)
          .set({
            'accept': 'application/json',
            'content-type': 'application/json',
            'x-access-token': jwtToken.token
          })
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            const assignments = res.body;

            assignments.should.be.length(13);
            assignments[0].should.have.property('name');
            assignments[0].should.have.property('totalPts');
            assignments[0].should.have.property('rules');

            done();
          });
      });
  });

  it('should GET a single assignment');       //not used by app yet

  it('should CREATE an assignment', function (done) {
    agent.get('/api/v1/courses')
      .set({
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-access-token': jwtToken.token
      })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        const course = res.body[0];
        const lengthInit = course.assignments.length;

        agent.post(`/api/v1/courses/${course.id}/assignments`)
          .set({
            'accept': 'application/json',
            'content-type': 'application/json',
            'x-access-token': jwtToken.token
          })
          .send({name:"final countdown", pts: 1000, rules: []})
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);

            agent.get('/api/v1/courses')
              .set({
                'accept': 'application/json',
                'content-type': 'application/json',
                'x-access-token': jwtToken.token
              })
              .expect(200)
              .end(function (err, res) {
                if (err) return done(err);
                const assignments = res.body[0].assignments;

                assignments.should.be.length(lengthInit + 1);
                assignments[0].should.have.property('name');

                done();
              });
          });
      });
  });

  it('should CHANGE a single assignment', function(done) {
    agent.get('/api/v1/courses')
      .set({
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-access-token': jwtToken.token
      })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        const courseInit = res.body[0];
        const assnName = courseInit.assignments[0].name;

        agent.put(`/api/v1/courses/${courseInit.id}/assignments/${assnName}`)
          .set({
            'accept': 'application/json',
            'content-type': 'application/json',
            'x-access-token': jwtToken.token
          })
          .send({name:"5D", pts: 5, rules: []})
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);

            agent.get('/api/v1/courses')
              .set({
                'accept': 'application/json',
                'content-type': 'application/json',
                'x-access-token': jwtToken.token
              })
              .expect(200)
              .end(function (err, res) {
                if (err) return done(err);
                const course = res.body[0];

                course.assignments[0].name.should.be.a('string');
                course.assignments[0].name.should.equal('5D');

                done();
              });
          });
      });
  });

  it('should DELETE a single assignment');       //not used by app yet
});

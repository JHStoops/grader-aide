const verifyToken = require('./verifyToken');
const express = require('express');
const router = express.Router();
const db = require('./db');

router.use(verifyToken);

router.route('/')
  .get(getAllCourses)
  .post(createCourse);

router.route('/:courseId')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

function getAllCourses(req, res) {
  db.getData('courses', {}, {})
    .then(function (data) {
      data.map(function (course) {
        course.id = course._id;
        delete course._id;
      });
      res.status(200).send(data);
    })
    .catch(err => res.sendStatus(400));
}

function createCourse(req, res) {
  if (req.grader != true) {
    sendForbidden(res);
  } else {
    db.insertData('courses', req.body)
      .then(function (data) {
        res.status(200).send({
          success: true,
          id: data.insertedId
        });
      });
  }
}

function getCourse(req, res) {
  db.getData('courses', req.params.courseId)
    .then(function (err) {
      if (err) console.log(err);
      res.sendStatus(200);
    })
    .catch(err => res.sendStatus(400));
}

function updateCourse(req, res) {
  if (req.grader != true) {
    sendForbidden(res);
  } else {
    db.setData('courses', req.params.courseId, req.body)
      .then(function (err) {
        if (err) console.log(err);
        res.sendStatus(200);
      })
      .catch(err => res.sendStatus(400));
  }
}

function deleteCourse(req, res) {
  if (req.grader != true) {
    sendForbidden(res);
  } else {
    db.removeData('courses', req.params.courseId)
      .then(function () {
        res.sendStatus(200);
      })
      .catch(err => res.sendStatus(400));
  }
}

function sendForbidden(res) {
  res.status(403).send({
    success: false,
    err: "You don't have permission to access this resource"
  })
}

module.exports = router;

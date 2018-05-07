const verifyToken = require('./verifyToken');
const express = require('express');
const router = express.Router();
const db = require('./db');

router.use(verifyToken);

router.route('/:courseId/assignments/')
  .get(getAllAssignments)
  .post(createAssignment);

router.route('/:courseId/assignments/:assignmentName')
  .get(getAssignment)
  .put(updateAssignment)
  .delete(deleteAssignment);


function getAllAssignments(req, res){
  //FIXME: return just the assignments array -- currently the projection option isn't working as intended.
  const filterObj = {_id: req.params.courseId};
  const options = {projection: {'name': false, '_id': false} };

  db.getData('courses', filterObj, options)
    .then(function(data){
      data.map(function(course){
        course.id = course._id;
        delete course._id;
      });
      res.status(200).send(data[0].assignments);
    })
    .catch(err => res.sendStatus(400));
}

function createAssignment(req, res) {
  const filterObj = {_id: req.params.courseId};
  const updateObj = {$push: {assignments: req.body} };
  const options = {};

  db.modifyData('courses', filterObj, updateObj, options)
    .then(function() {
      res.sendStatus(200);
    });
}

function getAssignment(req, res){
  const filterObj = {_id: req.params.courseId, 'assignments.name': req.params.assignmentName};
  const options = {projection: {'name': false, '_id': false, assignments: {$elemMatch: {name: req.params.assignmentName} }}};

  db.getData('courses', filterObj, options)
    .then(function(data){
      res.status(200).send(data[0].assignments[0]);
    })
    .catch(err => res.sendStatus(400));
}

function updateAssignment(req, res){
  const filterObj = {_id: req.params.courseId, 'assignments.name': req.params.assignmentName};
  const updateObj = { $set: {'assignments.$': req.body} };
  const options = {};

  db.modifyData('courses', filterObj, updateObj, options )  //Update first element in result assignments
    .then(function(err){
      if (err) console.log(err);
      res.sendStatus(200);
    })
    .catch(err => res.sendStatus(400));
}

function deleteAssignment(req, res){
  //FIXME: The onlysolution I found to remove an element in an array is using $pull which just empties the element -- it doesn't remove it from the array.
  const filterObj = {_id: req.params.courseId, 'assignments.name': req.params.assignmentName};
  const updateObj = { $set: {assignments: req.body} };
  const options = {};

  db.modifyData('courses', filterObj, updateObj, options)  //Update first element in result assignments
    .then(function(){
      res.sendStatus(200);
    })
    .catch(err => res.sendStatus(400));
}

module.exports = router;

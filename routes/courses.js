const express = require('express');
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');

const router = express.Router({ mergeParams: true });

// /api/v1/courses
router.route('/')
  .get(getCourses)
  .post(addCourse);

// /api/v1/courses/:id
router.route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);
  

module.exports = router;

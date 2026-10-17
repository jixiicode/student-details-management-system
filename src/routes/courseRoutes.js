const router = require('express').Router();
const c = require('../controllers/courseController');
router.get('/', c.getCourses); router.get('/:id', c.getCourse); router.post('/', c.createCourse); router.put('/:id', c.updateCourse); router.delete('/:id', c.deleteCourse);
module.exports = router;

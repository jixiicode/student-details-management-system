const router = require('express').Router();
const c = require('../controllers/resultController');
router.get('/', c.getResults); router.get('/:id', c.getResult); router.post('/', c.createResult); router.put('/:id', c.updateResult); router.delete('/:id', c.deleteResult);
module.exports = router;

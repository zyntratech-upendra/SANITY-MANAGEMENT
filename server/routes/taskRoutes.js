const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  startTask,
  completeTask,
} = require('../controllers/taskController');

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', createTask);
router.patch('/:id/start', startTask);
router.patch('/:id/complete', completeTask);

module.exports = router;


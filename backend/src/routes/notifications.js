const router = require('express').Router();
const ctrl = require('../controllers/notificationController');
const auth = require('../middleware/auth');

router.get('/', auth, ctrl.getAll);
router.patch('/:id/read', auth, ctrl.markRead);
router.patch('/read-all', auth, ctrl.markAllRead);
router.delete('/clear-all', auth, ctrl.clearAll);
router.delete('/:id', auth, ctrl.deleteNotification);

module.exports = router;

const router = require('express').Router();
const Joi = require('joi');
const ctrl = require('../controllers/exchangeRateController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const updateSchema = Joi.object({
  usd_to_syp: Joi.number().positive().required(),
  note: Joi.string().allow(null, ''),
});

router.get('/current', ctrl.getCurrent);
router.get('/history', auth, ctrl.getHistory);
router.post('/', auth, validate(updateSchema), ctrl.update);

module.exports = router;

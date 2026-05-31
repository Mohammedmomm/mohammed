const router = require('express').Router();
const Joi = require('joi');
const ctrl = require('../controllers/settingsController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const updateSchema = Joi.object({
  settings: Joi.alternatives().try(
    Joi.object().pattern(Joi.string(), Joi.string().allow(null, '')),
    Joi.array().items(
      Joi.object({
        key: Joi.string().required(),
        value: Joi.string().allow(null, ''),
      })
    )
  ).required(),
});

router.get('/public', ctrl.getPublic);
router.get('/', auth, ctrl.getAdmin);
router.put('/', auth, validate(updateSchema), ctrl.update);

module.exports = router;

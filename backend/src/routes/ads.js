const router = require('express').Router();
const Joi = require('joi');
const ctrl = require('../controllers/adController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const createSchema = Joi.object({
  title_ar: Joi.string().max(500).allow(null, ''),
  title_en: Joi.string().max(500).allow(null, ''),
  description_ar: Joi.string().allow(null, ''),
  description_en: Joi.string().allow(null, ''),
  image_url: Joi.string().uri().max(500).required(),
  link_url: Joi.string().uri().max(500).allow(null, ''),
  position: Joi.string().max(100).required(),
  is_active: Joi.boolean().default(true),
  start_date: Joi.date().iso().allow(null),
  end_date: Joi.date().iso().allow(null),
  sort_order: Joi.number().integer().default(0),
});

const updateSchema = createSchema.fork(['image_url', 'position'], (s) => s.optional());

// Public
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/:id/click', ctrl.trackClick);

// Admin
router.post('/', auth, validate(createSchema), ctrl.create);
router.put('/:id', auth, validate(updateSchema), ctrl.update);
router.delete('/:id', auth, ctrl.deleteAd);
router.patch('/:id/toggle-active', auth, ctrl.toggleActive);

module.exports = router;

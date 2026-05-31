const router = require('express').Router();
const Joi = require('joi');
const ctrl = require('../controllers/brandController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const createSchema = Joi.object({
  name: Joi.string().max(255).required(),
  name_ar: Joi.string().max(255).allow(null, ''),
  logo_url: Joi.string().uri().max(500).allow(null, ''),
  description_ar: Joi.string().allow(null, ''),
  description_en: Joi.string().allow(null, ''),
  sort_order: Joi.number().integer().default(0),
});

const updateSchema = Joi.object({
  name: Joi.string().max(255),
  name_ar: Joi.string().max(255).allow(null, ''),
  logo_url: Joi.string().uri().max(500).allow(null, ''),
  description_ar: Joi.string().allow(null, ''),
  description_en: Joi.string().allow(null, ''),
  sort_order: Joi.number().integer(),
  is_active: Joi.boolean(),
});

// Public
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// Admin
router.post('/', auth, validate(createSchema), ctrl.create);
router.put('/:id', auth, validate(updateSchema), ctrl.update);
router.delete('/:id', auth, ctrl.deleteBrand);
router.patch('/:id/toggle-active', auth, ctrl.toggleActive);

module.exports = router;

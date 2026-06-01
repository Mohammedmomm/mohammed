const router = require('express').Router();
const Joi = require('joi');
const ctrl = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const createSchema = Joi.object({
  name_ar: Joi.string().max(255).required(),
  name_en: Joi.string().max(255).required(),
  parent_id: Joi.number().integer().allow(null),
  icon: Joi.string().max(255).allow(null, ''),
  description_ar: Joi.string().allow(null, ''),
  description_en: Joi.string().allow(null, ''),
  sort_order: Joi.number().integer().default(0),
});

const updateSchema = Joi.object({
  name_ar: Joi.string().max(255),
  name_en: Joi.string().max(255),
  parent_id: Joi.number().integer().allow(null),
  icon: Joi.string().max(255).allow(null, ''),
  description_ar: Joi.string().allow(null, ''),
  description_en: Joi.string().allow(null, ''),
  sort_order: Joi.number().integer(),
  is_active: Joi.boolean(),
});

const reorderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({ id: Joi.number().required(), sort_order: Joi.number().required() })
  ).required(),
});

// Public routes
router.get('/tree', ctrl.getTree);
router.get('/flat', ctrl.getFlat);
router.get('/slug/:slug/products', ctrl.getProductsBySlug);
router.get('/slug/:slug', ctrl.getBySlug);
router.get('/:id', ctrl.getById);

// Admin routes
router.post('/', auth, validate(createSchema), ctrl.create);
router.put('/reorder', auth, validate(reorderSchema), ctrl.reorder);
router.put('/:id', auth, validate(updateSchema), ctrl.update);
router.delete('/:id', auth, ctrl.deleteCategory);

module.exports = router;

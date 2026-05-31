const router = require('express').Router();
const Joi = require('joi');
const ctrl = require('../controllers/specificationController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const templateSchema = Joi.object({
  field_key: Joi.string().max(100).required(),
  label_ar: Joi.string().max(255).required(),
  label_en: Joi.string().max(255).required(),
  field_type: Joi.string().valid('text', 'number', 'select', 'boolean', 'textarea').required(),
  unit: Joi.string().max(50).allow(null, ''),
  options: Joi.array().items(Joi.string()).allow(null),
  is_required: Joi.boolean().default(false),
  is_filterable: Joi.boolean().default(false),
  sort_order: Joi.number().integer().default(0),
});

const updateTemplateSchema = templateSchema.fork(
  ['field_key', 'label_ar', 'label_en', 'field_type'],
  (s) => s.optional()
);

const reorderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({ id: Joi.number().required(), sort_order: Joi.number().required() })
  ).required(),
});

const setSpecsSchema = Joi.object({
  specs: Joi.array().items(
    Joi.object({
      field_key: Joi.string().required(),
      value_ar: Joi.string().allow(null, ''),
      value_en: Joi.string().allow(null, ''),
      value_numeric: Joi.number().allow(null),
      unit: Joi.string().allow(null, ''),
    })
  ).required(),
});

// Template routes
router.get('/templates/category/:categoryId', ctrl.getTemplateByCategory);
router.post('/templates/category/:categoryId', auth, validate(templateSchema), ctrl.createTemplate);
router.put('/templates/reorder', auth, validate(reorderSchema), ctrl.reorderTemplates);
router.put('/templates/:id', auth, validate(updateTemplateSchema), ctrl.updateTemplate);
router.delete('/templates/:id', auth, ctrl.deleteTemplate);

// Product specs routes
router.get('/product/:productId', ctrl.getProductSpecs);
router.put('/product/:productId', auth, validate(setSpecsSchema), ctrl.setProductSpecs);
router.delete('/:id', auth, ctrl.deleteSpec);

module.exports = router;

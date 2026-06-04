const router = require('express').Router({ mergeParams: true });
const Joi = require('joi');
const ctrl = require('../controllers/variantController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const createSchema = Joi.object({
  variant_label_ar: Joi.string().max(255).required(),
  variant_label_en: Joi.string().max(255).required(),
  price_syp: Joi.number().positive().allow(null),
  price_usd: Joi.number().positive().allow(null),
  is_available: Joi.boolean().default(true),
  sort_order: Joi.number().integer().default(0),
});

const updateSchema = createSchema.fork(
  ['variant_label_ar', 'variant_label_en'],
  (s) => s.optional()
);

const reorderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({ id: Joi.number().required(), sort_order: Joi.number().required() })
  ).required(),
});

router.get('/', ctrl.getByProduct);
router.post('/sync', auth, ctrl.syncVariants);
router.post('/', auth, validate(createSchema), ctrl.create);
router.put('/reorder', auth, validate(reorderSchema), ctrl.reorder);
router.put('/:id', auth, validate(updateSchema), ctrl.update);
router.delete('/:id', auth, ctrl.deleteVariant);

module.exports = router;

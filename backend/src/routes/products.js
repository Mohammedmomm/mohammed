const router = require('express').Router();
const Joi = require('joi');
const ctrl = require('../controllers/productController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const createSchema = Joi.object({
  name_ar: Joi.string().max(500).required(),
  name_en: Joi.string().max(500).required(),
  description_ar: Joi.string().allow(null, ''),
  description_en: Joi.string().allow(null, ''),
  category_id: Joi.number().integer().allow(null),
  brand_id: Joi.number().integer().allow(null),
  price_syp: Joi.number().positive().allow(null),
  price_usd: Joi.number().positive().allow(null),
  has_variants: Joi.boolean().default(false),
  has_details: Joi.boolean().default(true),
  is_available: Joi.boolean().default(true),
  is_featured: Joi.boolean().default(false),
  tags: Joi.array().items(Joi.string()).allow(null),
  meta_keywords: Joi.string().allow(null, ''),
});

const updateSchema = createSchema.fork(
  ['name_ar', 'name_en'],
  (schema) => schema.optional()
);

const bulkPriceSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      id: Joi.number().required(),
      price_syp: Joi.number().positive().allow(null),
      price_usd: Joi.number().positive().allow(null),
    })
  ).required(),
});

const bulkPercentSchema = Joi.object({
  ids: Joi.array().items(Joi.number()).required(),
  percent: Joi.number().positive().required(),
  direction: Joi.string().valid('increase', 'decrease').required(),
});

const priceByNameSchema = Joi.object({
  name_pattern: Joi.string().required(),
  price_syp: Joi.number().positive().allow(null),
  price_usd: Joi.number().positive().allow(null),
});

// Public
router.get('/', ctrl.list);
router.get('/slug/:slug', ctrl.getBySlug);
router.get('/:id/similar', ctrl.getSimilar);
router.get('/:id/images', ctrl.getImages);
router.get('/:id/specs', ctrl.getSpecs);
router.get('/:id/variants', ctrl.getVariants);
router.get('/:id', ctrl.getById);

// Admin
router.post('/', auth, validate(createSchema), ctrl.create);
router.put('/bulk/price', auth, validate(bulkPriceSchema), ctrl.bulkPriceUpdate);
router.put('/bulk/price-percent', auth, validate(bulkPercentSchema), ctrl.bulkPricePercent);
router.put('/price-by-name', auth, validate(priceByNameSchema), ctrl.priceByName);
router.get('/price/search', auth, ctrl.priceSearch);
router.put('/:id', auth, validate(updateSchema), ctrl.update);
router.delete('/:id', auth, ctrl.deleteProduct);
router.patch('/:id/toggle-available', auth, ctrl.toggleAvailable);
router.patch('/:id/toggle-featured', auth, ctrl.toggleFeatured);

module.exports = router;

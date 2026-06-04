const router = require('express').Router({ mergeParams: true });
const Joi = require('joi');
const multer = require('multer');
const ctrl = require('../controllers/imageController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const updateImageSchema = Joi.object({
  alt_text_ar: Joi.string().max(255).allow(null, ''),
  alt_text_en: Joi.string().max(255).allow(null, ''),
});

const reorderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({ id: Joi.number().required(), sort_order: Joi.number().required() })
  ).required(),
});

router.get('/', ctrl.getProductImages);
router.post('/sync', auth, ctrl.syncImages);
router.post('/', auth, upload.array('images', 10), ctrl.addImages);
router.put('/reorder', auth, validate(reorderSchema), ctrl.reorderImages);
router.put('/:id', auth, validate(updateImageSchema), ctrl.updateImage);
router.delete('/:id', auth, ctrl.deleteImage);
router.patch('/:id/set-primary', auth, ctrl.setPrimary);

module.exports = router;

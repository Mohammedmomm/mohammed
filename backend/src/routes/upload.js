const router = require('express').Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const { uploadToSupabase } = require('../utils/uploadHelper');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.post('/image', auth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    const folder = req.query.folder || 'general';
    const { url, path } = await uploadToSupabase(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folder
    );
    res.json({ success: true, data: { url, path } });
  } catch (err) {
    next(err);
  }
});

router.post('/images', auth, upload.array('images', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }
    const folder = req.query.folder || 'general';
    const results = [];
    for (const file of req.files) {
      const { url, path } = await uploadToSupabase(file.buffer, file.originalname, file.mimetype, folder);
      results.push({ url, path, originalname: file.originalname });
    }
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

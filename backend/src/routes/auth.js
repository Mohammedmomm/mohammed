const router = require('express').Router();
const Joi = require('joi');
const { login, logout, me } = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

router.post('/login', validate(loginSchema), login);
router.post('/logout', auth, logout);
router.get('/me', auth, me);

module.exports = router;

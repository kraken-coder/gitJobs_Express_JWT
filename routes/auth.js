const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

//  @route   GET api/auth
// desc       get logged in  user
//  access   private

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'server error' });
    console.log(req);
  }
});

//  @route   POST api/auth
// desc      auth user and get token
//  access  public
router.post(
  '/',
  [
    check('email', 'please enter valid email').isEmail(),
    check('password', 'Please enter a valid password').exists()
  ],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json(err.array());
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.json('Invalid Credentials').status(400);
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json('invalid credentials');
      }
      const payload = {
        user: {
          id: user.id
        }
      };
      const secret = config.get('secret');
      jwt.sign(
        payload,
        secret,
        {
          expiresIn: 6000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).json('server error');
    }
  }
);

module.exports = router;

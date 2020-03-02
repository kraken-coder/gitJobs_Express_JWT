const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
//  @route   POST api/users
// desc       register a user
//  access   public
router.post(
  '/',
  [
    check('name', 'Plese enter name  ')
      .not()
      .isEmpty(),
    check('email', 'Please Include a valid email').isEmail(),
    check(
      'password',
      'Please Enter PassWord with six or more character'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.json({ msg: 'User Already Exist' }).status(400);
      }

      user = new User({
        name,
        password,
        email
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // gen token
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
      res.status(500).send('server error');
    }
  }
);

module.exports = router;

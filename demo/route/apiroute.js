
const express = require('express');
const passport = require('passport');

const db = require('../db');

const router = express.Router();

router.post('/get-info',
  passport.authenticate('bearer', { session: false }),
  async (req, res) => {
    if (req.user) {
      const user = await db.profiles.findByUsername(req.user.username);
      res.json({ user });
    } else {
      res.sendStatus(403);
    }
  });

module.exports = router;

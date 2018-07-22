const router = require('express').Router();
const passport = require('passport');

router.get('/', (req, res) => {
  res.render('homepage', { user: req.user });
});

router.get('/login', (req, res) => {
  let returnTo = req.session.returnTo || req.query.returnTo;
  if (returnTo === '/login') returnTo = '/';
  if (req.user) return res.redirect(returnTo || '/');
  return res.render('login', { user: req.user, returnTo });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect('/login?e=true');
    return req.logIn(user, (err2) => {
      if (err2) return next(err2);
      return res.redirect(req.body.returnTo ? req.body.returnTo : '/');
    });
  })(req, res, next);
});

module.exports = router;

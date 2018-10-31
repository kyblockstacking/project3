const router = require('express').Router();
const db = require('../models');
//remember "/" is being used by express.static

router.get('/categories/:thread', function(req, res) {
  if (req.session.user) {
    //you can post and vote
  } else {
    //you cannot post and vote
  }
});

//signup route
router.post('/api/signup', function(req, res) {
  if (
    req.body.firstName.match(/./) &&
    req.body.lastName.match(/./) &&
    req.body.userName.match(/.{4,12}/) &&
    req.body.email.match(
      /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
    ) &&
    req.body.password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    )
  ) {
    db.User.findOne({
      where: {
        userName: req.body.userName,
      },
    })
      .then((data) => {
        if (data === null) {
          const token = 't' + Math.random();
          req.body['token'] = token;
          res.cookie('token', token, {
            expires: new Date(Date.now() + 999999999),
          });
          //create login
          db.User.create(req.body)
            .then((data) => {
              //  *STILL NEEDED* redirect to where UI makes sense

              req.session.user = {
                firstName: user.firstName,
                username: user.userName,
                admin: user.admin,
                user: user.user,
                id: user.id,
              };

              res.json(data);
            })
            .catch((err) => {
              res.json(err);
            });
        } else {
          // we need to send a message to the user that username is taken
          return res.status(400).json({
            status: 'error',
          });
        }
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    return res.status(400).json({
      status: 'error',
    });
  }
});

router.post('/logout', function(req, res) {
  res.clearCookie('token');
  req.session.destroy();

  res.redirect('/');
});

//hardcoded for Javascript threads
router.get('/api/threads', function(req, res) {
  db.Threads.findAll({
    // include: [db.Comments],
    where: {
      CategoryId: 1,
    },
  }).then((results) => {
    console.log(results);
    res.json(results);
  });
});

//dynamically coded for javascript thread replies
router.get('/api/threads/:id', function(req, res) {
  db.Comments.findAll({
    where: {
      ThreadId: req.params.id,
    },
  }).then((results) => {
    console.log(results);
    res.json(results);
  });
});

router.post('/login', (req, res) => {
  db.User.findOne({
    where: {
      userName: req.body.userName,
      password: req.body.password,
    },
  })
    .then((user) => {
      req.session.user = {
        firstName: user.firstName,
        username: user.userName,
        admin: user.admin,
        user: user.user,
        id: user.id,
      };
      const token = 't' + Math.random();
      res.cookie('token', token, {
        expires: new Date(Date.now() + 999999999),
      });
      db.User.update({ token: token }, { where: { id: user.id } }).then(
        (data) => {
          res.json(req.session.user);
        },
      );
    })
    .catch((err) => {
      res.send('username or password does not match');
    });
});

router.get('/auth', (req, res) => {
  if (req.session.user) {
    res.send(`welcome back, ${req.session.user.firstName}`);
  } else if (req.headers.cookie.indexOf('token=') !== -1) {
    const cookie = req.headers.cookie.match(/(?<=token=)[^ ;]*/)[0];
    db.User.findOne({
      where: {
        token: cookie,
      },
    })
      .then((user) => {
        if (user !== null) {
          req.session.user = {
            firstName: user.firstName,
            username: user.userName,
            admin: user.admin,
            user: user.user,
            id: user.id,
          };
          res.json(user);
        } else {
          res.clearCookie('token');
        }
      })
      .catch((err) => {
        res.json(err);
      });
  }
});

module.exports = router;

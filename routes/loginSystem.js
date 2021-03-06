const router = require('express').Router();
const db = require('../models');

let loggedIn = false;

router.post('/api/signup', (req, res) => {
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
            .then((user) => {
              //  *STILL NEEDED* redirect to where UI makes sense
              loggedIn = true;
              req.session.user = {
                firstName: user.firstName,
                username: user.userName,
                admin: user.admin,
                user: user.user,
                id: user.id,
                loggedIn: loggedIn,
              };
              res.json(req.session.user);
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
        res.json(err);
      });
  } else {
    return res.status(400).json({
      status: 'error',
    });
  }
});

router.get('/logout', function (req, res) {
  loggedIn = false;
  res.clearCookie('token');
  req.session.destroy();
  res.json(loggedIn);
});

router.post('/login', (req, res) => {
  db.User.findOne({
    where: {
      userName: req.body.userName,
      password: req.body.password,
    },
  })
    .then((user) => {
      loggedIn = true;

      req.session.user = {
        firstName: user.firstName,
        username: user.userName,
        admin: user.admin,
        user: user.user,
        id: user.id,
        loggedIn: loggedIn,
        upvote: user.upvote,
        downvote: user.downvote,
      };

      if (user.upvote - user.downvote > 1000) {
        req.session.user.admin = true;
        db.User.update({ admin: true }, { where: { id: user.id } }).then(
          () => {
            console.log("Updated status to Mentor");
          },
        );
      }

      const token = 't' + Math.random();
      res
        .cookie('token', token, {
          expires: new Date(Date.now() + 999999999),
        })
        .json(req.session.user);

      db.User.update({ token: token }, { where: { id: user.id } }).then(
        (data) => {
          console.log(data);
        },
      );
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get('/auth', (req, res) => {
  if (req.session.user) {
    res.json({
      firstName: req.session.user.firstName,
      username: req.session.user.username,
      admin: req.session.user.admin,
      user: req.session.user.user,
      id: req.session.user.id,
      loggedIn: loggedIn,
      upvote: req.session.user.upvote,
      downvote: req.session.user.downvote,
    });
  }
  // else if (req.headers.cookie.indexOf('token=') !== -1) {
  // changed else if statement to remove 'cannot find index of'
  else if (req.headers.cookie) {
    if (req.headers.cookie.match(/(?<=token=)[^ ;]*/) !== null) {
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
            loggedIn: loggedIn,
            upvote: user.upvote,
            downvote: user.downvote,
          };
          res.json(req.session.user);
        } else {
          res.clearCookie('token');
          res.end();
        }
      })
      .catch((err) => {
        res.json(err);
      });
    } else{
      res.end();
    }
    
  } else {
    res.end();
  }
});

router.get('/api/profile/:user', (req, res) => {
  db.User.findOne({
    where: {
      userName: req.params.user,
    },
  })
    .then((user) => {
      res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        upvote: user.upvote,
        downvote: user.downvote,
      });
    })
    .catch((error) => {
      res.json(error);
    });
});

module.exports = router;

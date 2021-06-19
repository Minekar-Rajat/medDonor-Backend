const express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');

const User = require('../models/users');
const Needy = require('../models/needy');
const Donor = require('../models/donor');

const usersRouter = express.Router();
// usersRouter.use(express.json());
usersRouter.use(bodyParser.json());
usersRouter.use(bodyParser.urlencoded({ extended: true }));

usersRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find({})
      .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT Operation is not supported !");
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT Operation is not supported !");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, err => next(err))
      .catch(er => next(err));
  });

usersRouter.route('/signup')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .post(cors.corsWithOptions, (req, res, next) => {
    User.register(new User(req.body), req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-type', 'application/json');
        res.json({ err: err });
      }
      else {

        user.save((err, user) => {
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json({ success: true, status: 'User registered succesfully !!' });
          });
        });

      }
    })
  });

usersRouter.route('/login')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .post(cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' });
  });

usersRouter.route('/:userID')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    User.findById(req.params.userID)
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
      }, err => next(err))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    User.findByIdAndUpdate(req.params.userID, { $set: req.body }, { new: true })
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);

      }, err => next(err))
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST Operation is not supported !");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    User.findByIdAndRemove(req.params.userID)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, err => next(err))
      .catch(er => next(err));
  });


usersRouter.route('/:userID/request')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    User.findById(req.params.userID)
      .then((user) => {
        Needy.find({ user: user._id })
          .populate('user')
          .then((request) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(request);
          }, err => next(err))
          .catch(err => next(err));
      }, err => next(err))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    User.findById(req.params.userID)
      .then((user) => {
        Needy.findByIdAndUpdate(req.body.needyID, { $set: req.body.update }, { new: true })
          .then((request) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(request);
          }, err => next(err))
          .catch(err => next(err));

      }, err => next(err))
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST Operation is not supported !");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    User.findById(req.params.userID)
      .then((user) => {
        Needy.findByIdAndRemove(req.body.needyID)
          .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
          }, err => next(err))
          .catch(err => next(err));

      }, err => next(err))
      .catch(err => next(err));
  });



usersRouter.route('/:userID/donation')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    User.findById(req.params.userID)
      .then((user) => {
        Donor.find({ user: user._id })
          .populate('user')
          .then((donation) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(donation);
          }, err => next(err))
          .catch(err => next(err));
      }, err => next(err))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    User.findById(req.params.userID)
      .then((user) => {
        Donor.findByIdAndUpdate(req.body.donorID, { $set: req.body.update }, { new: true })
          .then((donation) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(donation);
          }, err => next(err))
          .catch(err => next(err));

      }, err => next(err))
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST Operation is not supported !");

  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    User.findById(req.params.userID)
      .then((user) => {
        Donor.findByIdAndRemove(req.body.donorID)
          .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
          }, err => next(err))
          .catch(err => next(err));

      }, err => next(err))
      .catch(err => next(err));
  });





module.exports = usersRouter;


var express = require('express');
var reqRouter = express.Router();
var User = require('../models/users');
var Needy = require('../models/needy');
var authenticate = require('../authenticate');
var cors = require('./cors');



reqRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Needy.find({})
            .populate('user')
            .then((needys) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(needys);
            }, err => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Needy.create(req.body)
            .then((needy) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(needy);

            }, err => next(err))
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT Operation is not supported !");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Needy.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, err => next(err))
            .catch(er => next(err));
    });

reqRouter.route('/:reqID')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Needy.findById(req.params.reqID)
            .populate('user')
            .then((needy) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(needy);
            }, err => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Needy.findByIdAndUpdate(req.params.reqID, { $set: req.body }, { new: true })
            .then((needy) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(needy);

            }, err => next(err))
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("POST Operation is not supported !");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Needy.findByIdAndRemove(req.params.reqID)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, err => next(err))
            .catch(er => next(err));
    });



module.exports = reqRouter;

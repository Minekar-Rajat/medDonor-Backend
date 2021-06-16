var express = require('express');
var reqRouter = express.Router();
var User = require('../models/users');
var Needy = require('../models/needy');
var authenticate = require('../authenticate');
var cors = require('./cors');



reqRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        console.log("Request for Needy");
        Needy.find({})
            .populate('user')
            .then((needys) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(needys);
            }, err => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        Needy.create(req.body)
            .then((needy) => {
                console.log("Needy is created");
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(needy);

            }, err => next(err))
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT Operation is not supported !");
    })
    .delete(cors.corsWithOptions, (req, res, next) => {
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
        console.log("Request for Needy");
        Needy.findById(req.params.reqID)
            .populate('user')
            .then((needy) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(needy);
            }, err => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        Needy.findByIdAndUpdate(req.params.reqID, { $set: req.body }, { new: true })
            .then((needy) => {
                console.log("Needy is updated");
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(needy);

            }, err => next(err))
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end("POST Operation is not supported !");
    })
    .delete(cors.corsWithOptions, (req, res, next) => {
        Needy.findByIdAndRemove(req.params.reqID)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, err => next(err))
            .catch(er => next(err));
    });



module.exports = reqRouter;

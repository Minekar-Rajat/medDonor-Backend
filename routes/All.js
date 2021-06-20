var express = require('express');
var bodyparser = require('body-parser');
var User = require('../models/users');
var Donor = require('../models/donor');
var Needy = require('../models/needy');
var cors = require('./cors');
var authenticate = require('../authenticate');

var Allrouter = express.Router();
Allrouter.use(bodyparser.json());



Allrouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {

        var result = [];
        Donor.find({})
            .populate('user')
            .then((donors) => {
                result.push(donors);
            }, err => next(err))
            .catch((err) => next(err));
        Needy.find({})
            .populate('user')
            .then((needys) => {
                result.push(needys);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(result);
            }, err => next(err))
            .catch((err) => next(err));


    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("POST Operation is not supported !");
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT Operation is not supported !");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        var response = [];
        Donor.remove({})
            .then(resp => {
                response.push(resp);
            }, err => next(err))
            .catch(err => next(err))
        Needy.remove({})
            .then(resp => {
                response.push(resp);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, err => next(err))
            .catch(err => next(err));
    });


module.exports = Allrouter;

var express = require('express');
var donationRouter = express.Router();
var User = require('../models/users');
var Donor = require('../models/donor');


donationRouter.route('/')
    .get((req, res, next) => {
        console.log("Request for Donations");
        Donor.find({})
            .populate('user')
            .then((donors) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(donors);
            }, err => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Donor.create(req.body)
            .then((donor) => {
                console.log("Donor is created");
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(donor);

            }, err => next(err))
            .catch(err => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT Operation is not supported !");
    })
    .delete((req, res, next) => {
        Donor.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, err => next(err))
            .catch(er => next(err));
    });



donationRouter.route('/:donorID')
    .get((req, res, next) => {
        console.log("Request for Donor");
        Donor.findById(req.params.donorID)
            .populate('user')
            .then((donor) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(donor);
            }, err => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        Donor.findByIdAndUpdate(req.params.donorID, { $set: req.body }, { new: true })
            .then((donor) => {
                console.log("Donor is updated");
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(donor);

            }, err => next(err))
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST Operation is not supported !");
    })
    .delete((req, res, next) => {
        Donor.findByIdAndRemove(req.params.donorID)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, err => next(err))
            .catch(er => next(err));
    });


module.exports = donationRouter;

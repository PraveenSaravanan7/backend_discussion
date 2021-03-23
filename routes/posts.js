var express = require('express');
var router = express.Router();
var authJWT = require('../middleware/auth');
const bodyParser = require('body-parser');
const Posts = require('../models/posts');

router.route('/')
    .get((req, res, next) => {
        Posts.find().sort({ createdAt: -1 }).populate([{
            path: 'userid',
            options: { select: "email name" }},{
            path: 'replies.userid',     
            options: { select: "email name" }}
        ])
            .then((posts) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(posts);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(authJWT, (req, res, next) => {
        Posts.updateOne({ _id: req.body._id, userid: req.user.userid }, req.body)
            .then((posts) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(posts);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(authJWT, (req, res, next) => {
        req.body.userid = req.user.userid
        Posts.create(req.body)
            .then((posts) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(posts);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

router.route('/reply/:id')
    .put(authJWT, (req, res, next) => {
        req.body.userid = req.user.userid
        let postid = req.params.id
        Posts.updateOne({ _id: postid }, { $push: { replies: [req.body] } })
            .then((posts) => {
                // res.statusCode = 200;
                // res.setHeader('Content-Type', 'application/json');
                // res.json(posts);

                Posts.findOne({_id: postid}).populate([{
                    path: 'userid',
                    options: { select: "email name" }},{
                    path: 'replies.userid',     
                    options: { select: "email name" }}
                ])
                    .then((posts) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(posts);
                    }, (err) => next(err))
                    .catch((err) => next(err));

            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = router;
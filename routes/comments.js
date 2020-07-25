const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// Route to add new comments
router.get('/new', middleware.isLoggedIn, (req, res) => {
    // Get campground id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

// Post request for new comments
router.post('/', middleware.isLoggedIn, (req, res) => {
    // Create and add new comment to campground
    // redirect to camground
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash('error', 'Something went wrong when trying to add the comment');
                    console.log(err);
                } else {
                    // add Username and user_id to comment.author
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Your comment was added successfully');
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

// Route to edit comment
router.get('/:cid/edit', middleware.checkCommentsOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err || !camp) {
            req.flash('error', 'No campground found');
            return res.redirect('back');
        }
        Comment.findById(req.params.cid, (err, commentFound) => {
            if (err) {
                res.redirect('back');
            } else {
                res.render('comments/edit', {camp_id: req.params.id, comment: commentFound});
            }
        });
    });
});

// Route to update comment
router.put('/:cid', middleware.checkCommentsOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.cid, req.body.comment, (err, updatedComment) => {
        if (err) {
            req.flash('error', 'Your comment could not be updated');
            res.redirect('back');
        } else {
            req.flash('success', 'Your comment was successfully updated');
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// Route to delete coomment
router.delete('/:cid', middleware.checkCommentsOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.cid, (err) => {
        if (err) {
            req.flash('error', 'An error occured while trying to delete the comment');
            res.redirect('back');
        } else {
            req.flash('success', 'Your comment was successfully deleted');
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});



module.exports = router;
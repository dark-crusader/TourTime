const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');


// Route to add new comments
router.get('/new', isLoggedIn, (req, res) => {
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
router.post('/', isLoggedIn, (req, res) => {
    // Create and add new comment to campground
    // redirect to camground
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    // add Username and user_id to comment.author
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

// Route to edit comment
router.get('/:cid/edit', checkCommentsOwnership, (req, res) => {
    Comment.findById(req.params.cid, (err, commentFound) => {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {camp_id: req.params.id, comment: commentFound});
        }
    });
});

// Route to update comment
router.put('/:cid', checkCommentsOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.cid, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// Route to delete coomment
router.delete('/:cid', checkCommentsOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.cid, (err) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// Middleware to check ownership
function checkCommentsOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.cid, (err, foundComment) => {
            if (err) {
                res.redirect('back');
            } else {
                // Check if user owns the post
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

module.exports = router;
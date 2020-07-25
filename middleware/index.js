const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewares = {};

// Middleware to check ownership of Campgrounds
middlewares.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campFound) => {
            if (err) {
                res.redirect('back');
            } else {
                // Check if user owns the post
                if (campFound.author.id.equals(req.user._id)) {
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

// Middleware to check ownership of comments
middlewares.checkCommentsOwnership = (req, res, next) => {
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
middlewares.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

module.exports = middlewares;
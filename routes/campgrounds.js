const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// Index route for campgrounds
router.get('/', (req, res) => {
    // Get all campgrounds from database
    Campground.find({}, (err, camps) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/campgrounds', {camps: camps});
        }
    });
});

// Creates a new Campground
router.post('/', isLoggedIn,(req, res) => {
    // Get new data from form
    const newCamp = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user.id,
            username: req.user.username
        }
    };
    // Creating a new Campground and saving it to the database
    Campground.create(newCamp, (err, camp) => {
        if (err) {
            console.log(err);
        } else {
            // Redirect to /campgrounds
            console.log(camp);
            res.redirect('/campgrounds');
        }
    });
});

// Route to add a new Campground
router.get('/new', isLoggedIn,(req,res) => {
    res.render('campgrounds/new');
});

// Route to fetch info on a specific campground
router.get('/:id', (req, res) => {
    // Find campground with provided id
    Campground.findById(req.params.id).populate('comments').exec((err, camp) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: camp});
        }
    });
});

// Edit Campground
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
    // Check for authorization of user
    Campground.findById(req.params.id, (err, campFound) => {
        res.render('campgrounds/edit', {campground: campFound});
    });
});

// Update Campground
router.put('/:id', checkCampgroundOwnership, (req, res) => {
    // Find and update the campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, modCamp) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// Delete route for campground
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect('/campgrounds');
        }
        res.redirect('/campgrounds');
    });
});

// Middleware to check ownership
function checkCampgroundOwnership(req, res, next) {
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

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
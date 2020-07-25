const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

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
router.post('/', middleware.isLoggedIn,(req, res) => {
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
router.get('/new', middleware.isLoggedIn,(req,res) => {
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
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    // Check for authorization of user
    Campground.findById(req.params.id, (err, campFound) => {
        res.render('campgrounds/edit', {campground: campFound});
    });
});

// Update Campground
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
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
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect('/campgrounds');
        }
        res.redirect('/campgrounds');
    });
});


module.exports = router;
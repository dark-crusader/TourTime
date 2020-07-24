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
    const name = req.body.name;
    const img = req.body.image;
    const description = req.body.description;
    // Creating a new Campground and saving it to the database
    Campground.create({name: name, image: img, description: description}, (err, camp) => {
        if (err) {
            console.log(err);
        } else {
            // Redirect to /campgrounds
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

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
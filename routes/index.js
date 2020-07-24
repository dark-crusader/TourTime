
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req,res) => {
    res.render('index');
});

// Auth routes

// Show registration form
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle Signup logic
router.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });
    });
});

// Show login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {
});

// Handle logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
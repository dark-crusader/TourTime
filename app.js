const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');

mongoose.connect('mongodb://localhost:27017/tour_time', {useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`));

// Seeding database with initial data
seedDB();

// Configuration for Passport
app.use(require('express-session')({
    secret: 'Web development is tough',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req,res) => {
    res.render('index');
});

app.get('/campgrounds', (req, res) => {
    // Get all campgrounds from database
    Campground.find({}, (err, camps) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/campgrounds', {camps: camps});
        }
    });
});

app.post('/campgrounds', (req, res) => {
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
            res.redirect('campgrounds/campgrounds');
        }
    });
});

// Route to add a new Campground
app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new');
});

// Route to fetch info on a specific campground
app.get('/campgrounds/:id', (req, res) => {
    // Find campground with provided id
    Campground.findById(req.params.id).populate('comments').exec((err, camp) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: camp});
        }
    });
});

// Routes for comments
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    // Get campground id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

// Auth routes

// Show registration form
app.get('/register', (req, res) => {
    res.render('register');
});

// Handle Signup logic
app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {
});

// Handle logout
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

app.listen(port = 8080, () => {
    console.log(`App stated at localhost:${port}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds');

mongoose.connect('mongodb://localhost:27017/tour_time', {useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public/images/"));

// Seeding database with initial data
seedDB();

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
app.get('/campgrounds/:id/comments/new', (req, res) => {
    // Get campground id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

app.post('/campgrounds/:id/comments', (req, res) => {
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


app.listen(port = 8080, () => {
    console.log(`App stated at localhost:${port}`);
});
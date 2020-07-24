const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/tour_time', {useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public/images/"));

// Schema Setup
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

const Campground = mongoose.model('Campground', campgroundSchema);
// Testing creation of a campground
// Campground.create({name: 'Camp 2', image: 'camp_2.jpg'}, (err, camp) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('New Campground Created');
//         console.log(camp);
//     }
// });

app.get('/', (req,res) => {
    res.render('index');
});

app.get('/campgrounds', (req, res) => {
    // Get all campgrounds from database
    Campground.find({}, (err, camps) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds', {camps: camps});
        }
    });
});

app.post('/campgrounds', (req, res) => {
    // Get new data from form
    const name = req.body.name;
    const img = req.body.image;
    // Creating a new Campground and saving it to the database
    Campground.create({name: name, image: img}, (err, camp) => {
        if (err) {
            console.log(err);
        } else {
            // Redirect to /campgrounds
            res.redirect('/campgrounds');
        }
    });
});

app.get('/campgrounds/new', (req,res) => {
    res.render('new');
});

app.listen(port = 8080, () => {
    console.log(`App stated at localhost:${port}`);
});
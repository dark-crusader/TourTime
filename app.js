const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public/images/"));

// Global Variables
const campgrounds = [
    {name: 'Camp 1', image: 'camp_1.jpg'},
    {name: 'Camp 2', image: 'camp_2.jpg'},
    {name: 'Camp 3', image: 'camp_3.jpg'},
    {name: 'Camp 1', image: 'camp_1.jpg'},
    {name: 'Camp 2', image: 'camp_2.jpg'},
    {name: 'Camp 3', image: 'camp_3.jpg'},
    {name: 'Camp 1', image: 'camp_1.jpg'},
    {name: 'Camp 2', image: 'camp_2.jpg'},
    {name: 'Camp 3', image: 'camp_3.jpg'},
];

app.get('/', (req,res) => {
    res.render('index');
});

app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', {camps: campgrounds});
});

app.post('/campgrounds', (req, res) => {
    // Get new data from form
    const name = req.body.name;
    const img = req.body.image;
    campgrounds.push({name: name, image: img});
    // Redirect to /campgrounds
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req,res) => {
    res.render('new');
});

app.listen(port = 8080, () => {
    console.log(`App stated at localhost:${port}`);
});
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
// Initial seed data
const data = [
    {
        name: 'Starry Night',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT9mpTxCYW-TBjMIi4a6MXbVNm-gJ0AmlUiZw&usqp=CAU',
        description: 'Welcome to Starry Night'
    },
    {
        name: 'Frost Forest',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQgI-F3kAT8Zwpe7l4tRud3w-AwwGibRTODgA&usqp=CAU',
        description: 'Welcome to Frost Forest'
    },
    {
        name: 'Green Hollow',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQmTVay8crh7PAJGMwnS91wZg3BLgxnxtAuQ&usqp=CAU',
        description: 'Welcome to Green Hollow'
    },
    {
        name: 'Sunny Side UP',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTJOBBexCkdBenMmUl3t4zzr60K1iLCfrq8Rg&usqp=CAU',
        description: 'Welcome to Sunny Side UP'
    }
];

function seedDB() {
    // Remove all campgrounds
    Campground.deleteMany({}, err => {
        if (err) {
            console.log(err);
        } else {
            console.log('Removed all campgrounds.');
            // Add initial campgrounds
            data.forEach(seed => {
                Campground.create(seed, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`${data.name} added to the list of campgrounds.`);
                        // Add dummy comments
                        Comment.create(
                            {
                                text: 'Cool Place',
                                author: 'Tester 1'
                            }, (err, comment) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    data.comments.push(comment);
                                    data.save();
                                    console.log('Created new comment.');
                                }
                            });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;
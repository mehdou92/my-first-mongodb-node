const mongoose = require('mongoose');

mongoose.connect("mongodb://mongo", {
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS,
    dbName: process.env.MONGODB_DBNAME,
    useNewUrlParser: true
});

const db = mongoose.connection;
const MovieSchema = new mongoose.Schema({
    title: String,
    createdAt: Date,
    year: {
        type: Number,
        min: 1896
    },
    category: {
        type: String,
        enum: ['Drama', 'SF', 'Comedy', 'Action']
    }
});


MovieSchema.pre('save', function(next) {
    console.log('Saving...' + this.title);
    next();
});

MovieSchema.post('save', function(doc) {
    console.log(doc.title + ' is saved!');
});

const Movie = mongoose.model('Movie', MovieSchema);

db.once('open', () => {
    let movie = new Movie({
        title: "Avengers 4",
        createdAt: new Date(),
        year: 2019,
        category: "Action"
    });

    movie.save().then(data =>  console.log(data)).catch(error => console.log("error"));
});
db.on('error', (error) => console.log("Error: ", error));
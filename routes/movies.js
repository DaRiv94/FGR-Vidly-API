const {validate, Movie} =require('../models/movie');
const {Genre} = require('../models/genre');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

/**We are using a hybrid model for storeing data, the id and the name of a genre will be embedded 
 * inside a movie, but for anything else related to the genre we would query the genre collection using the id
 * embedded in the movie object. we could have either extreme of only haveing an id and always querying the genre
 * object, or have all genre info embeded into the movie object. including the name property of the genre
 * is choosen beacuse it may commonly be needed when using movies, so its the judgment call of, 
 * if you are going to need this property alot embedd it, if its not always related with an object,
 * and you are not querying all the time for it, then have them separate and just make querys when needed.
 */


router.get('/', async (req,res)=>{
    const movies =  await Movie.find().sort('name');

    res.send(movies);
});

router.post('/', auth, async (req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send('Error: '+ error.details[0].message);

    const genre = await Genre.findById(req.body.genreId); //the genreId must be from the list of genres in the database.
    if(!genre) return res.status(404).send('Not valid Genre.');

    const movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre:  {
            _id : genre.id,
            name : genre.name
        }

    });

    await movie.save();
    res.send(movie);

});

router.put('/:id', auth, async (req,res)=>{

    const {error} = validate(req.body);
    if(error) return res.status(400).send('Error: '+ error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Not valid Genre.');

    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('could not find movie 404.')

    movie.set({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre:  {
            _id : genre.id,
            name : genre.name
        }
    });
    

    await movie.save()
    res.send(movie);


});

router.delete('/:id', auth, async (req,res)=>{

    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie) return res.status(404).send('could not find movie 404.')

    res.send(movie);

});

router.get('/:id', async (req,res)=>{

    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('could not find movie 404.')

    res.send(movie);
});

module.exports = router;


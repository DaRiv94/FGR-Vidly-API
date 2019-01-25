const {validate, Rental} =require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn =require('fawn');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');

Fawn.init(mongoose)

router.get('/', async (req,res)=>{
    const rentals= await Rental.find().sort('customer.name');
    res.send(rentals);
});

router.post('/', auth, async (req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(404).send('Could not find customer with ID given');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(404).send('Could not find movie with ID given');

    if(movie.numberInStock ===0) return res.status(400).send('movie not in stock');

    const rental = new Rental({
        customer:{
            _id: customer._id,
            name:customer.name,
            phone:customer.phone
        },
        movie:{
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    //need to look uo and understand transaction when it comes to databases,
    //the big idea of a transaction is that you want to do multiple CRUD operations, but you want to make sure all
    //those operations either fail or succeed together. in my case here, I want to update the movie object and also
    //save a new rental object, but I dont both to happen or neither, so I would use a transaction.
    //in this situation im using a package called fawn which simulates a transaction,
    // and uses a process called two phase commit in the background which is a mongodb way of dealing
    // with multple data operations that should all work or fail together.
    //all operations performed within the Fawn task will be treated as a unit. they will fail or succed together.
    try{
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id:movie._id}, {
                $inc:{numberInStock: -1}
            })
            .run();

          res.send(rental);  
    }catch(err){
        res.status(500).send('Something failed.')
    }

    //await rental.save();

    //movie.numberInStock--;
    //await movie.save();

    


});



module.exports = router;
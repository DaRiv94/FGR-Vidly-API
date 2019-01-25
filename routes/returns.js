const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const auth = require('../middleware/auth');
const moment = require('moment');
const {Movie} = require('../models/movie');
const Joi = require('joi');
const validate = require('../middleware/validate');


router.post('/', [auth, validate(validateReturn)], async (req,res)=>{

        const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

        if(!rental) return res.status(404).send('could not find rental for movieId and customerId');

        if(rental.dateReturned) return res.status(400).send('return already processed');

        rental.return();
        await rental.save();

        await Movie.update({_id:rental.movie._id}, {
            $inc:{numberInStock : 1}
        });

        return res.send(rental);
        
});

function validateReturn(rental){
    const schema ={
        customerId: Joi.objectId().required(),
        movieId:Joi.objectId().required(),
        
    }

    return Joi.validate(rental, schema)
}

module.exports =router;
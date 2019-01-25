const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const validateObjectId = require('../middleware/validateObjectId');



router.get('/', async (req,res, next)=>{
       
        const genres = await Genre.find().sort('name');
        console.log(genres);
        res.send(genres);
   
});

//with all these routes you can pass the route, middleware, and then the req, and res.
router.post('/', auth, async (req,res)=>{

    //validate the reqest body to make sure its valid, sendback 400 bad request if it isnt
    const {error} = validate(req.body) //deconstructed from result.error //this is for when we were not using the database
    if(error) return res.status(400).send(error.details[0].message);

    //save to database
    const genre = new Genre( {name: req.body.name} );
    await genre.save();
    res.send(genre);

});

router.get('/:id', validateObjectId, async (req,res)=>{



    //find if genre exists by id
    //if it doesnt then 404 not found
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send(`could not find genre with id: ${req.params.id}`);
    
    //if found send back to client
    res.send(genre);

    
});

router.put('/:id', [auth, validateObjectId], async (req,res)=>{
    ///validate the reqest body to make sure its valid, sendback 400 bad request if it isnt
    const {error} = validate(req.body) //deconstructed from result.error //this is for when we were not using the database
    if(error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genre.findByIdAndUpdate( req.params.id, {name: req.body.name}, {new:true} );

    if(!genre) return res.status(404).send(`could not find genre with id: ${req.params.id}`);


    res.send(genre);
});

//multiple middlewares are used here, auth first and then admin
router.delete('/:id', [auth, admin, validateObjectId], async (req,res)=>{
    //find if genre exists by id
    //if it doesnt then 404 not found
    //delete genre
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre) return res.status(404).send(`could not find genre with id: ${req.params.id}`);
    
    //send deleted genre back to client
    res.send(genre);
});




module.exports = router;
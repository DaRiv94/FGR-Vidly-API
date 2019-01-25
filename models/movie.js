const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('../models/genre');


const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        trim:true,
        minlength:5,
        maxlength:255
        },
    numberInStock:{
        type:Number,
        required:true,
        min:0,
        max:255
        },
    dailyRentalRate:{
        type:Number,
        required:true,
        min:0,
        max:255
        },
    genre: {
        type: genreSchema,
        required:true
        }

});

const Movie = mongoose.model('movie', movieSchema);

function validateMovie(movie){
    const schema ={
        title: Joi.string().min(5).max(50).required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required(),
        genreId: Joi.objectId().required()
    }

    return Joi.validate(movie, schema)
}
exports.movieSchema = movieSchema;
exports.Movie= Movie;
exports.validate= validateMovie;

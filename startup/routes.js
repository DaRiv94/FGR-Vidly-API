const genreRoutes= require('../routes/genres');
const customersRoutes= require('../routes/customers');
const homeRoutes= require('../routes/home');
const movieRoutes= require('../routes/movies');
const rentalRoutes= require('../routes/rentals');
const userRoutes= require('../routes/users');
const authRoutes =require('../routes/auth');
const returnRoutes =require('../routes/returns');
const error = require('../middleware/error');
const express = require('express');


module.exports = function(app){
    app.use(express.json());
    app.use('/api/genres', genreRoutes);//genre routes are in genres.js
    app.use('/api/customers', customersRoutes);//customer routes are in customers.js
    app.use('/api/movies', movieRoutes); //movie routes are in movies.js
    app.use('/api/rentals', rentalRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/returns', returnRoutes);
    app.use('/', homeRoutes);
    app.use(error);
}
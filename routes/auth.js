const config = require('config');
const jwt = require('jsonwebtoken');
const { User} =require('../models/user');
const express = require('express');
const router = express.Router();
const _ =require('lodash'); //by convention people use an _ to rep lodash, same with underscore
const bcrypt =require('bcrypt');
const Joi = require('joi');

//login
router.post('/', async (req,res)=>{
   const {error} = validate(req.body);
   if(error)return res.status(400).send(error.details[0].message);

   let user = await User.findOne({email:req.body.email});
   if(!user) return res.status(400).send('Invalid username or password');

   let validPassword = await bcrypt.compare(req.body.password, user.password);
   if(!validPassword) res.status(400).send('Invalid username or password');

   
   const token =user.generateJsonWebToken();

   res.send(token);


});

function validate(user){
    const schema ={
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(4).max(255).required()//the password will be hashed into a longer string of 1024 chars
    }

    return Joi.validate(user, schema)
}


module.exports = router;


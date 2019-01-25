const {validate, User} =require('../models/user');
const express = require('express');
const router = express.Router();
const _ =require('lodash'); //by convention people use an _ to rep lodash, same with underscore
const bcrypt =require('bcrypt');
const auth = require('../middleware/auth');




router.get('/me', auth, async (req,res)=>{
    const user = await User.findById(req.user._id).select('-password'); //this finds th user but doesnt include their password.

    res.send(user);
});

//register new user
router.post('/', async (req,res)=>{
   const {error} = validate(req.body);
   if(error)return res.status(400).send(error.details[0].message);

   let user = await User.findOne({email:req.body.email});
   if(user) return res.status(400).send('there is already a user with that email.');

   //the pick method creates an object from an object you have, and just allows you to pick the propertys you want to give your new object.
   user = new User(_.pick(req.body, ['name','email','password']));
//     user = new User({ //this is what we would do without the _.pick() method.
//         name: req.body.name,
//         email:req.body.email,
//         password:req.body.password
//    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
   await user.save();

   const token =user.generateJsonWebToken();
//when sending custom headers prefix your headers with 'x-' then a custom lowercase name.
   res.header('x-auth-token',token).send(_.pick(user,['_id','name','email']));


});

module.exports = router;


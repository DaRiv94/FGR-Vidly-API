const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt=require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength: 5,
        maxlength:255
    },
    password:{ //if I want more complex password requiurments I can use the package joi-password-complexity
        type:String,
        required:true,
        minlength:4,
        maxlength:1024
    },
    isAdmin:Boolean
    /** you could have multiple ways to decide who can modify what,
     * and in a complex application you may have permissions[] with an array with creategenre, deletegenre
     * where all are booleans and all permissions are send via the json web token. 
     * then what the client can do is made known to the server without extra querys to the database.
    */
    
});


/** the jwtPrivateKey can be anything but its very important that it is kept secret
store it in an environment variable*/
/** the user class has the information and expertise to generatea json web token for the user, which is why
the responablity is delagated here.*/
/**remember to use the this keyword inside an object or instance you can NOT use an arrow function, the traditional function must be used.*/
//using the schema.methods.methodName you create an instance method, 
//using the schema.statics.staticMethodName you create a static method
userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({_id:this._id, isAdmin:this.isAdmin}, config.get('jwtPrivateKey'));
}

const User = mongoose.model('user', userSchema);

function validateUser(user){
    //if I want more complex password requiurments I can use the package joi-password-complexity
    const schema ={
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(4).max(255).required()//the password will be hashed into a longer string of 1024 chars
    }

    return Joi.validate(user, schema)
}
exports.userSchema = userSchema;
exports.User= User;
exports.validate= validateUser;

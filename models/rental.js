const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');


const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            isGold:{
                type:Boolean,
                 default:false
                },
            name:{
                type:String,
                required:true,
                minlength:5,
                maxlength:50,
            },
            phone:{
                type:String,
                 required:true,
                  minlength:5,
                  maxlength:50 //something is wrong, I got an error with max:50 when a phone was 12345 but minlength is fine
                  //but when I have a value of 1234 the minlength validation doesnt work 
                  
            }
        }),
    },
    movie:{
        type: new mongoose.Schema({
            title:{
                type:String,
                required: true,
                trim:true,
                minlength:5,
                maxlength:255
                },
            dailyRentalRate:{
                type:Number,
                required:true,
                min:0,
                max:255
                }
        }),
    },
    dateRented: {
        type:Date,
         required:true,
          default:Date.now
        },
    dateReturned:{
        type:Date
    },
    rentalFee:{
        type:Number,
        min:0
    }

});

rentalSchema.statics.lookup= function(customerId, movieId){
    return Rental.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
};

rentalSchema.methods.return = function(){
    this.dateReturned = new Date();

    //uses moment.js libaray to give the difference in days between now and rental.dateRented.
    const numberOfDaysRented = moment().diff(this.dateRented, 'days');
    this.rentalFee = numberOfDaysRented * this.movie.dailyRentalRate;
}


const Rental = mongoose.model('rental', rentalSchema);

function validateRental(rental){
    const schema ={
        customerId: Joi.string().required(),
        movieId:Joi.objectId().required(),
        
    }

    return Joi.validate(rental, schema)
}

exports.Rental= Rental;
exports.validate= validateRental;

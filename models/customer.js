const mongoose = require('mongoose');
const Joi = require('joi');


const customerSchema = new mongoose.Schema({
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
          maxlength:50 
    }
});

const Customer = mongoose.model('customer', customerSchema);

function validateCustomer(customer){
    const schema ={
        isGold:Joi.bool().default(false),
        name:Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required()
    }

    return Joi.validate(customer,schema);
}
exports.customerSchema=customerSchema;
exports.Customer=Customer;
exports.validate=validateCustomer;
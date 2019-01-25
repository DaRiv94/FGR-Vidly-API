const config = require('config');


//a better practice then console logging the problem would be to use a logging package,
//and then to throw an expection.
//if you throw error objects and not strings you can see the stack trace later
module.exports = function(){
    if(!config.get('jwtPrivateKey')){
        console.log('FATAL ERROR; jwtPrivateKey is not defined.');
        process.exit(1); //with process.exit the whole process will exit with anything but 0.
    }
    
}
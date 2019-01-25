require('express-async-errors'); //Im not sure how to test this but it should help when I have 500 errors
const winston = require('winston');

module.exports = function(){
    
    
    //this is removed to winston can do its thing with winston.handleExpections
    // process.on('uncaughtException', (ex)=>{
    //     console.log('WE GOT AN UNCAUGHT EXCEPTION');
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });

    winston.handleExceptions(
        new winston.transports.Console({colorize: true, prettyPrint: true}),
        new winston.transports.File({filename: 'uncaughtExecptions.log'})
    );
    
    //I tried making a mock promise rejection and still got it as an uncaughtException so im not sure if this is needed.
    process.on('unhandledRejection', (ex)=>{
        // console.log('WE GOT AN UNCAUGHT EXCEPTION');
        // winston.error(ex.message, ex);
        // process.exit(1);

        //throw an exception here and winston will use handleEceptions on it.
        throw ex;
    });

    winston.add(winston.transports.File, {filename:'logfile.log'});
    
}
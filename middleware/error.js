const winston = require('winston');


module.exports = function(err, req, res, next){

    //winston.log('error', err.message);
    winston.error(err.message, err);

    ////winston log hiearchy
    //error
    //warn
    //info
    //verbose
    //debug
    //silly


    //log to server the error
    res.status(500).send('Something Failed.')
}
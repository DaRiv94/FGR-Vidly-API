const helmet = require('helmet');
const compression = require('compression');


module.exports = function (app){
    app.use(helmet()); //helps from basic web vunerablities
    app.use(compression()); //compresses html responses to the client.
};
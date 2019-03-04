const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());//this is to allow browsers to access this api publicly
app.use(express.static('.'));//this is to render the static index.html page at the root


require('./startup/logging')(); //all our logging logic
require('./startup/validation')(); //validation logic
require('./startup/routes')(app); //all of our route logic
require('./startup/mongodb')(); //connect to mongodb
require('./startup/config')(); //configuration logic
require('./middleware/prod')(app);//has compression and helmet package;

const port= process.env.PORT || 4000;
const server = app.listen(port, (err)=>{
    if(err) return console.log(err);
    console.log(`running on port ${port}...`)
});

module.exports = server;
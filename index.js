const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());



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
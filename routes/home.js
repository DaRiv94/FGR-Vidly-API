const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.sendFile(__dirname+"/index.html");
    res.end();
});

module.exports = router;
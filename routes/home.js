const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.send('This is The home page');
    res.end();
});

module.exports = router;
const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.send('SHAER API SERVER 0.1');
})


module.exports = router;
const express = require('express');
const router = express.Router();

const main = require('./main');
const user = require('./user');
const realty= require('./realty');
const realty_question = require('./realty_question');
const like = require('./like');


router.use('/',main);
router.use('/users',user);
router.use('/realty',realty);
router.use('/realty_question', realty_question);
router.use('/like', like);

module.exports = router;
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const REST_API = require('./routes'); //rest api 라우팅
const models = require('./models').sequelize; // db sequelize


app.use(bodyParser.urlencoded({extended:false}));  //req.body 인식
app.use(bodyParser.json()); //req에서 body를 읽어옴


app.use('/api',REST_API);


models.sync().then(() => {
    // require('./assets')(); // DB 기본값 넣기.
}); // Sequelize를 통해 DB 접근.


app.listen(3000, function () {
    console.log(process.env.MYSQL_HOST);
});


module.exports =app;

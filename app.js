const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const REST_API = require('./routes'); //rest api 라우팅
const models = require('./models').sequelize; // db sequelize
const cors = require('cors');


app.use(bodyParser.urlencoded({extended:false}));  //req.body 인식
app.use(bodyParser.json()); //req에서 body를 읽어옴


app.use('/api',REST_API);
app.use(cors()); // CORS 제한을 제거함.


models.sync().then(() => {
    // require('./assets')(); // DB 기본값 넣기.
}); // Sequelize를 통해 DB 접근.


app.listen(4000, function () {
    console.log(process.env.MYSQL_HOST);
});


module.exports =app;

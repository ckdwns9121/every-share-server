const initUser = require('./user');
const initRealty = require('./realty');

const init =()=>{
    initUser.init();
    initRealty.init();
}

module.exports = init;
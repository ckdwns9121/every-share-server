'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};



const sequelize =  new Sequelize(config.database, config.username, config.password, config);

// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/* table create */
db.User = require('./user')(sequelize,Sequelize); // 유저 DB
db.Realty = require('./realty')(sequelize,Sequelize); // 매물 DB
db.RealtyQuestion= require('./realty_question')(sequelize,Sequelize); // 매물 문의자 DB
db.Like = require('./like')(sequelize,Sequelize) //매물 좋아요

/* 관계 설정 */


// 등록자 - 매물 관계
db.User.hasMany(db.Realty, { foreignKey: 'user_id', sourceKey: 'user_id' }); 
db.Realty.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'user_id' });

// 문의자 - 매물 문의 관계
db.User.hasMany(db.RealtyQuestion, { foreignKey: 'user_id', sourceKey: 'user_id' }); 
db.RealtyQuestion.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'user_id' });

// 매물 - 매물 문의자 관계
db.Realty.hasMany(db.RealtyQuestion, { foreignKey: 'realty_id', sourceKey: 'realty_id' }); 
db.RealtyQuestion.belongsTo(db.Realty, { foreignKey: 'realty_id', targetKey: 'realty_id' });


// 좋아요 - 유저 관계
db.User.hasMany(db.Like, { foreignKey: 'user_id', sourceKey: 'user_id' }); 
db.Like.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'user_id' });

// 좋아요 - 매물 관계
db.Realty.hasMany(db.Like, { foreignKey: 'realty_id', sourceKey: 'realty_id' }); 
db.Like.belongsTo(db.Realty, { foreignKey: 'realty_id', targetKey: 'realty_id' });




module.exports = db;

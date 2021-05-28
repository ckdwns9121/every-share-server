/*
    USER 모델 정의하기
    sequelize('객체이름','스키마 정의', '테이블 설정')
*/
module.exports = (sequelize, DataTypes)=>{
    return sequelize.define(
    'users' ,
    {
        user_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            comment: "유저 id"
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false,
            comment: "이메일"
        },
        name: {
            type: DataTypes.STRING(255),
            comment: "고객이름"
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: "패스워드"
        },
        phone_number: {
            type: DataTypes.STRING(15),
            unique: true,
            allowNull: false,
            comment: "휴대폰번호"
        },
        agree_sms: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: "0: 거부, 1: 동의"
        },
        agree_push: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: "0: 거부, 1: 동의"
        },
        register_type: {
            type: DataTypes.STRING(150),
            comment: "NULL: 일반가입자, naver:네이버, facebook:페이스북, kakao:카카오"
        },
        native_token: {
            type: DataTypes.STRING(255),
        },
    },
    {
        timestamps: true,
        underscored: true,
    },
    )
}

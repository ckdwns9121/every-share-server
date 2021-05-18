// 매물 테이블 문의자
module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'realty_question',
        {},
        {
            timestamps: true,
            underscored: true,
            tableName:'realty_question'
        },
    );
};

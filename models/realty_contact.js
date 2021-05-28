// 매물 테이블 문의자
module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'realty_contact',
        {},
        {
            timestamps: true,
            underscored: true,
            tableName:'realty_contact'
        },
    );
};

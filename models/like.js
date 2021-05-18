// 매물 찜하기
module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'likes',
        {},
        {
            timestamps: true,
            underscored: true,
            tableName:'likes'
        },
    );
};

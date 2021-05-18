// 매물 테이블
module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'realty',
        {
            realty_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
                comment: "매물 id"
            },
            addr: {
                allowNull: false,
                type: DataTypes.STRING(255),
                comment: "매물 주소"
            },
            addr_detail: {
                allowNull: false,
                type: DataTypes.STRING(255),
                comment: "매물 상세주소"
            },
            addr_extra: {
                type: DataTypes.STRING(255),
                comment: "매물 여분주소"
            },
            post_num: {
                type: DataTypes.STRING(255),
                comment: "매물 우편번호"
            },
            lat: {
                allowNull: false,
                type: DataTypes.FLOAT(17, 13),
                comment: "위도"
            },
            lng: {
                allowNull: false,
                type: DataTypes.FLOAT(17, 13),
                comment: "경도"
            },
            realty_name: {
                allowNull: false,
                type: DataTypes.STRING(255),
                comment: "매물 이름"
            },
            realty_comment: {
                allowNull: false,
                type: DataTypes.STRING(255),
                comment: "매물 설명"
            },
            realty_images: {
                // allowNull: false,
                type: DataTypes.JSON,
                comment: "매물 이미지"
            },
            contract_images: {
                // allowNull: false,
                type: DataTypes.JSON,
                comment: "임시 계약서 이미지"
            },
            realty_type: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: "매물 타입 = 0: 주차타운, 1: 지하주차장, 2: 지상주차장, 3: 지정주차"
            },
            options: {
                type: DataTypes.JSON,
                defaultValue: 0,
                comment: "매물 옵션"
            },
            monthly_rent: {
                allowNull: false,
                type: DataTypes.INTEGER.UNSIGNED,
                defaultValue: 0,
                comment: "월세"
            },
            maintenance_charge: {
                allowNull: false,
                type: DataTypes.INTEGER.UNSIGNED,
                defaultValue: 0,
                comment: "관리비"
            },
            oper_start_time: {
                allowNull: false,
                type: DataTypes.DATE,
                comment: "입주 시작 시간"
            },
            oper_end_time: {
                allowNull: false,
                type: DataTypes.DATE,
                comment: "입주 종료 시간"
            },
            realty_status: {
                type: DataTypes.STRING(255),
            },
            hit: {
                type: DataTypes.INTEGER.UNSIGNED,
                defaultValue: 0,
                comment: "조회 수"
            },
        },
        {
            timestamps: true,
            underscored: true,
        },
    );
};

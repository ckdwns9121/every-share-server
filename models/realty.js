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
        comment: '매물 id',
      },
      realty_name: {
        type: DataTypes.STRING(255),
        comment: '건물 이름',
      },
      realty_type: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '건물 유형 = 0: 원룸, 1: 투룸, 2: 오피스텔 ',
      },
      realty_kind: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '거래 종류 = 0: 월세, 1: 전세',
      },
      realty_all_floors: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '전체 층수',
      },
      realty_my_floors: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '현재 층수',
      },
      deposit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '보증금',
      },
      monthly_rent: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '월세',
      },
      maintenance_charge: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '관리비',
      },
      realty_comment: {
        allowNull: false,
        type: DataTypes.STRING(255),
        comment: '매물 설명',
      },
      addr: {
        allowNull: false,
        type: DataTypes.STRING(255),
        comment: '매물 주소',
      },
      addr_detail: {
        allowNull: false,
        type: DataTypes.STRING(255),
        comment: '매물 상세주소',
      },
      region_1depth_name: {
        type: DataTypes.STRING(255),
        comment: '시',
      },
      region_2depth_name: {
        type: DataTypes.STRING(255),
        comment: '구',
      },
      region_3depth_name: {
        type: DataTypes.STRING(255),
        comment: '동',
      },
      addr_extra: {
        type: DataTypes.STRING(255),
        comment: '매물 여분주소',
      },
      post_num: {
        type: DataTypes.STRING(255),
        comment: '매물 우편번호',
      },
      lat: {
        allowNull: false,
        type: DataTypes.FLOAT(17, 13),
        comment: '위도',
      },
      lng: {
        allowNull: false,
        type: DataTypes.FLOAT(17, 13),
        comment: '경도',
      },
      realty_subcomment: {
        type: DataTypes.STRING(255),
        comment: '매물 추가 설명',
      },
      realty_images: {
        // allowNull: false,
        type: DataTypes.JSON,
        comment: '매물 이미지',
      },
      realty_contract_images: {
        // allowNull: false,
        type: DataTypes.JSON,
        comment: '임시 계약서 이미지',
      },

      realty_options: {
        type: DataTypes.JSON,
        defaultValue: 0,
        comment: '매물 옵션',
      },

      oper_start_time: {
        allowNull: false,
        type: DataTypes.DATE,
        comment: '입주 시작 시간',
      },
      oper_end_time: {
        allowNull: false,
        type: DataTypes.DATE,
        comment: '입주 종료 시간',
      },
      realty_status: {
        type: DataTypes.STRING(255),
      },
      hit: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        comment: '조회 수',
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
};

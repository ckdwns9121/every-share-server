

/* 
    레코드 다루기 (CRUD)
    sequlize는 기본적인 CRUD 오퍼레이션 이외에도 다양한 기능을 제공한다.

    1. 레코드 만들기
    User.create({
        user_id : '1',
        email :'test@naver.com'
    })
    2. 레코드 조회하기
    User.findOne ({
        where :{user_id :'1'}
    })

*/

const {Realty} = require('../models');

const initRealty = {
    realty_id: 1,
    addr : '부산광역시 사하구 하단동 500-8번지',
    addr_detail : '동아대학교 S14 인바이즈',
    addr_extra : '',
    // post_num:null,
    // lat:37.5,
    // lng:158.0,
    // realty_name:'에덴빌라',
    // realty_comment:'여름방학동안 방 비워요',
    // realty_images:null,
    // contract_images:null,
    // realty_type:0,
    // monthly_rent:500,
    // maintenance_charge:5,
    // oper_start_time: new Date('2020/12/12'),
    // oper_end_time: new Date('2021/05/12'),
    // realty_status:'1',
    // hit:0.
};


// user db 초기화.
const init = async () => {
    const { realty_id } = initRealty;
    await Realty.findOrCreate({
        where: { realty_id },
        defaults: initRealty
    });
};

module.exports = {
    init
};
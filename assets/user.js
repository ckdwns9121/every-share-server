

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

const {User} = require('../models');

const initUser = {
    user_id: 1,
    email: 'ckdwns9121@gmail.com',
    name: '테스터',
    password: '1234',
    profile_image : null
    // phone_number: '01012341234',
    // birth: new Date('1993/12/11')
};


// user db 초기화.
const init = async () => {
    const { user_id } = initUser;
    await User.findOrCreate({
        where: { user_id },
        defaults: initUser
    });
};

module.exports = {
    init
};
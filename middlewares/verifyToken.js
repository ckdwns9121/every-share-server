const jwt = require('jsonwebtoken');

const JWT_SECRET = 'jwtSecret';
/*
    verifyToken 미들웨어를 통하여 클라이언트에게 헤더로 받은 토큰의 유효성을 체크한다.
*/
const verifyToken = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            res.status(401).json({ msg: '로그인 후에 이용해 주세요.' });
        }
        const CLIENT_TOKEN = req.headers.authorization.split('Bearer ')[1];
        // const decoded = jwt.verify(CLIENT_TOKEN, process.env.JWT_SECRET);
        const decoded = jwt.verify(CLIENT_TOKEN, JWT_SECRET);
        if (decoded) {
            const { user_id, email } = decoded;
            if (user_id && email) {
                req.decodeToken = decoded;
                next();
            } else {
                res.status(401).json({ msg: '잘못된 로그인 정보입니다.' });
            }
        } else {
            res.status(401).json({ msg: '잘못된 로그인 정보입니다.' });
        }
    } catch (err) {
        res.status(401).json({ msg: '잘못된 로그인 정보입니다.' });
    }
};

module.exports = verifyToken;

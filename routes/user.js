
const express = require('express');
const router = express.Router(); 
const jwt = require('jsonwebtoken'); //JWT 토큰 생성
const bcrypt = require('bcrypt'); // 비밀번호 해싱

const {User} = require('../models'); //유저 모델 가져오기
const verifyToken = require('../middlewares/verifyToken'); //토큰 유효성 검사하기 위한 미들웨어
const path = require('path');
const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/');
      },
      filename: function (req, file, cb) {
        cb(null, new Date().valueOf() + path.extname(file.originalname));
      }
    }),
  });

/* 유저 정보 가져오기 */
router.get ('/',verifyToken ,async(req,res,next)=>{

    const {user_id, email} = req.decodeToken;
    try{
        const user = await User.findOne({where :{user_id,email}}); 

        if(!user) {
            return res.status(202).send({message:'가입하지 않은 이메일입니다.'});
        }
        return res.status(200).send({message:'success',user});

    }
    catch(e){
        console.log(e);
    }
})

/* 유저 회원가입 */
router.post('/signup', async(req,res)=>{

    const {email,name,password} = req.body;
    try{
        // 이미 가입한 이메일인지 체크
        const existUser = await User.findOne({where :{email}});

        //이미 가입한 이메일이라면 회원가입 실패
        if(existUser){
            return res.status(202).send({message:'이미 가입한 이메일입니다.'});
        }

        //회원가입 진행중 비밀번호 해싱
        const hash = await bcrypt.hash(password,12); 

        //비밀번호 해싱 실패
        if(!hash){
            return res.status(202).send({message :'비밀번호를 설정하지 못하였습니다.'});
        }
        //새로운 유저 생성
        const createUser = await User.create({
            email,
            name,
            password : hash
        });

        //유저를 생성하지 못했을 시
        if(!createUser){
            return res.status(202).send({message:'failed'});
        }

        const JWT_TOKEN = jwt.sign({
            user_id : createUser.dataValues.user_id,
            email:'temporaty'
        },
            process.env.JWT_SECRET
        ); 
        //임시 토큰 생성
        if(!JWT_TOKEN){
            return res.status(202).send({message:'JWT_TOKEN 생성 실패'});
        }
        return res.status(202).send({message:'success',JWT_TOKEN});

    }
    catch(e){
      // DB 삽입 도중 오류 발생.
      console.log('오류 발생');
      console.log(e);
  
    }
} )

/* 유저 로그인 */
router.post('/signin', async (req, res, next) => {

    const { email, password } = req.body;

    try {
        const existUser = await User.findOne({where: { email }}); // 가입한 이메일인지 확인.
        if (!existUser) {
            
            // 가입하지 않은 이메일로 로그인을 할 수 없음.
            return res.status(202).send({ message: '가입하지 않은 이메일입니다.' });
        }
        const result = await bcrypt.compare(password, existUser.password);
        if (!result) {
            // 해싱한 비밀번호가 일치하지 않음.
            return res.status(202).send({ message: '비밀번호가 일치하지 않습니다.' });
        }
        const token = jwt.sign(
            {
                user_id: existUser.dataValues.user_id,
                email: email,
            },
            process.env.JWT_SECRET,
        ); // JWT_TOKEN 생성.
        if (!token) {
            return res.status(202).send({ message: 'token을 생성하지 못했습니다.' });
        }
        return res.status(200).send({ message: 'success', token });
    } catch (e) {
      
        console.log(e);
    }
});


/* 유저 프로필 이미지 변경 */

router.put('/profile_image' , verifyToken , upload.single('profile_image') , async(req,res,next)=>{
    try{
        const profile_image = req.file.path;
        const {user_id , email} = req.decodeToken;

        console.log(profile_image);
        
        const existUser = await User.findOne({where :{user_id, email}});

        if(!existUser){
            return res.status(202).send({message:'가입하지 않은 이메일입니다.'});
        }

        const updateUser = await User.update({profile_image},{where :{user_id ,email}});

        if(!updateUser){
            return res.status(202).send({message:'업데이트 중 오류가 발생했습니다.'});
        }
        return res.status(201).send({message : profile_image});

    }
    catch(e){
        console.log(e);
    }
})
module.exports = router;
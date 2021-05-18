const express = require('express');
const router = express.Router(); 
const verifyToken = require('../middlewares/verifyToken'); //토큰 유효성 검사하기 위한 미들웨어
const {Realty,RealtyQuestion} = require('../models'); //매물 모델 가져오기


router.get('/',verifyToken , async(req,res)=>{

    const {user_id} = req.decodeToken;
    try{
        const existQuestions = await RealtyQuestion.findAll({
            where:{user_id},
            include:[{model:Realty}]
            
        });
        if(!existQuestions){
            return res.status(202).send({message:'문의한 매물이 없습니다.'});
        }
        return res.status(200).send({message:'success' , questions: existQuestions});
    }
    catch(e){
        if(e.table){
            res.status(202).send({message:'db error'});
        }
    }
})

/* 매물 문의하기 */
router.post('/:realty_id', verifyToken , async(req,res)=>{

    const {realty_id} = req.params;
    const {user_id} = req.decodeToken;
    try{
        const existQuestion = await RealtyQuestion.findOne({
            where :{realty_id , user_id}
        })
        if(existQuestion){
            return res.status(202).send({message:'이미 문의한 매물입니다.'});
        }
        const createQuestion = await RealtyQuestion.create({
            realty_id,user_id
        })
        if(!createQuestion){
            return res.status(202).send({message:'failed'});
        }
        return res.status(200).send({message:'success'});

    }
    catch(e){
        console.log(e);
        if(e.table){
            return res.status(202).send({message:'db error'});
        }
    }
})

module.exports=router;
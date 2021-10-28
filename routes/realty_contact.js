const express = require('express');
const router = express.Router(); 
const verifyToken = require('../middlewares/verifyToken'); //토큰 유효성 검사하기 위한 미들웨어
const {Realty, RealtyContact} = require('../models'); //매물 모델 가져오기

/* 내가 문의한 내역 */
router.get('/',verifyToken , async(req,res)=>{

    const {user_id} = req.decodeToken;
    
    try{
        // const existContacts = await RealtyContact.findAll({
        //     where:{user_id},
        //     include:[{model:Realty}]
        // });
        const existContacts = await RealtyContact.findAll({
            where:{user_id},
            include:[{model:Realty}]
        });
        if(!existContacts){
            return res.status(202).send({message:'문의한 매물이 없습니다.'});
        }
        return res.status(200).send({message:'success' , contacts: existContacts});
    }
    catch(e){
        if(e.table){
            return res.status(202).send({message:'db error'});
        }
    }
})

/* 매물 문의하기 */
router.post('/:realty_id', verifyToken , async(req,res)=>{

    const {realty_id} = req.params;
    const {user_id} = req.decodeToken;
    try{
        const existContacts = await RealtyContact.findOne({
            where :{realty_id , user_id}
        })
        if(existContacts){
            return res.status(202).send({message:'이미 문의한 매물입니다.'});
        }
        const enrollment_user = await Realty.findOne({
            where : {realty_id}
        })
        const createContact = await RealtyContact.create({
            realty_id, user_id ,enrollment_user_id : enrollment_user.user_id
        })
        if(!createContact){
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

/* 매물 문의온 내역 */
router.get('/notice', verifyToken , async(req,res)=>{


    const {user_id} = req.decodeToken;
    try{
        const existContacts = await RealtyContact.findAll({
            where :{enrollment_user_id:user_id},
            include :[{model:Realty}]
        });
        if(!existContacts){
            return res.status(202).send({message:'문의온 매물이 없습니다.'});
        }
        return res.status(200).send({message:'success' , contacts: existContacts});
    }
    catch(e){
        if(e.table){
            return res.status(202).send({message:'db error'});
        }
    }
})
module.exports=router;
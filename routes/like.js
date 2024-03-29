const express = require('express');
const router = express.Router(); 
const verifyToken = require('../middlewares/verifyToken'); //토큰 유효성 검사하기 위한 미들웨어
const {Like,Realty} = require('../models'); //매물 모델 가져오기


/* 내가 찜한 매물 */
router.get('/',verifyToken , async(req,res)=>{
    const {user_id} = req.decodeToken;
    try{
        const existLike = await Like.findAll({
            where:{user_id},
            include:[{model:Realty}]
        });
        if(existLike){
            return res.status(200).send({message:'success',likes:existLike});
        }
        return res.status(202).send({message:'찜한 매물이 없습니다.'});
    }
    catch(e){
        return res.status(202).send({message:'db error'});
    }
})



/* 매물 좋아요 체크*/
router.get('/:realty_id',verifyToken , async(req,res)=>{
    const {user_id} = req.decodeToken;
    const {realty_id} =req.params;
    try{
        const existLike = await Like.findOne({where:{user_id,realty_id}});
        if(existLike){
            return res.status(200).send({message:'success',like:true});
        }
        return res.status(200).send({message:'success',like:false});
    }
    catch(e){
        return res.status(202).send({message:'db error'});
    }
})

/* 매물 찜하기 */
router.post('/:realty_id', verifyToken , async(req,res)=>{

    const {realty_id} = req.params;
    const {user_id} = req.decodeToken;
    try{
        const existLike = await Like.findOne({
            where :{realty_id , user_id}
        })
        if(existLike){
            await Like.destroy({
                where :{realty_id,user_id}
            })
            return res.status(200).send({message:'success',isLiked:false});
        }
        const createLike = await Like.create({
            realty_id,user_id
        })
        if(!createLike){
            return res.status(202).send({message:'failed'});
        }
        return res.status(200).send({message:'success',isLiked:true});
    }
    catch(e){
        console.log(e);
        if(e.table){
            return res.status(202).send({message:'db error'});
        }
    }
})

/* 매물 찜 취소 */
router.delete('/:realty_id', verifyToken , async(req,res)=>{

    const {realty_id} = req.params;
    const {user_id} = req.decodeToken;
    try{
        
        const existLike = await Like.findOne({
            where :{realty_id , user_id}
        })
        if(!existLike){
            return res.status(202).send({message:'찜하지 않은 매물입니다.'});
        }
        const deleteLike = await Like.destroy({
           where:{realty_id,user_id}
        })
        if(!deleteLike){
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
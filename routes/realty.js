const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken'); //토큰 유효성 검사하기 위한 미들웨어
const essentialToken = require('../middlewares/essentialToken'); //토큰이 불필요 해도 되는 페이지에서 쓰는 미들웨어
const {
  Realty,
  Like,
  RealtyLately,
  Sequelize: { Op },
} = require('../models'); //매물 모델 가져오기
const path = require('path');
const multer = require('multer');

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + file.originalname); // cb 콜백함수를 통해 전송된 파일 이름 설정
    },
  }),
});

//최근 본방 조회
router.get('/lately', essentialToken, async (req, res) => {
  const { ids } = req.query;
  try {
    const arr = [];

    ids &&
      Array.isArray(ids) &&
      arr.push({
        [Op.or]: ids.map(f => ({ realty_id: parseInt(f) })),
      });
    if (!Array.isArray(ids) || ids.length === 0) {
      // 필터링 항목이 없으면 반환 배열 0
      return res.status(200).send({ message: 'success', realties: [] });
    }
    const realties = await Realty.findAll({
      where: { [Op.and]: arr },
    });
    if (!realties) {
      return res.status(202).send({ message: '매물이 존재하지 않습니다.' });
    }
    return res.status(200).send({ message: 'success', realties: realties });
  } catch (e) {}
});

/* 매물 정보 리스트 요청 */
router.get('/', essentialToken, async (req, res) => {
  const { lat, lng, filter } = req.query;
  console.log(filter);

  try {
    const whereArray = [];

    filter &&
      Array.isArray(filter) &&
      whereArray.push({
        [Op.or]: filter.map(f => ({ realty_kind: parseInt(f) })),
      });
    if (!Array.isArray(filter) || filter.length === 0) {
      // 필터링 항목이 없으면 반환 배열 0
      return res.status(200).send({ message: 'success', realties: [] });
    }

    console.log(whereArray);
    const realties = await Realty.findAll({
      where: { [Op.and]: whereArray },
      include: [{ model: Like, attributes: ['id', 'user_id', 'realty_id'] }],
    }); //리스트 조회

    if (!realties) {
      return res.status(202).send({ message: '매물이 존재하지 않습니다.' });
    }
    const newState = [];

    if (req.decodeToken) {
      const { user_id } = req.decodeToken;
      for (const post of realties) {
        let like = await Like.findOne({
          where: {
            [Op.and]: [{ realty_id: post.realty_id }, { user_id: user_id }],
          },
        });
        const obj = {
          ...post.dataValues,
          isLiked: like ? true : false,
        };
        newState.push(obj);
      }
      return res.status(200).send({ message: 'success', realties: newState });
    } else {
      return res.status(200).send({ message: 'success', realties: realties });
    }
  } catch (e) {
    console.log(e);
  }
});

/* 내가 등록한 매물 */
router.get('/my', verifyToken, async (req, res) => {
  const { user_id } = req.decodeToken;
  try {
    const my_realties = await Realty.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
    });

    if (!my_realties) {
      return res.status(202).send({ message: '매물이 존재하지 않습니다.' });
    }
    return res.status(200).send({ message: 'success', my_realties });
  } catch (e) {
    console.log(e);
  }
});

/* 매물 정보 상세보기 */
router.get('/:realty_id', essentialToken, async (req, res) => {
  const { realty_id } = req.params;
  console.log('start');
  try {
    const realty = await Realty.findOne({ where: { realty_id } });
    if (!realty) {
      return res.status(202).send({ message: '존재하지 않는 매물입니다.' });
    }
    await realty.increment('hit');
    if (req.decodeToken) {
      const { user_id } = req.decodeToken;
      const { user_id: enroolment_user_id } = realty;
      console.log(enroolment_user_id);
      const like = await Like.findOne({
        where: { realty_id, user_id },
        order: [['created_at', 'DESC']],
      });
      const isLiked = like ? true : false;
      return res.status(200).send({ message: 'success', realty, isLiked });
    } else {
      return res.status(200).send({ message: 'success', realty });
    }
  } catch (e) {
    console.log('error');
    console.log(e);
  }
});

router.get;

/* 매물 등록하기 */
router.post(
  '/',
  verifyToken,
  upload.fields([
    { name: 'realty_images', maxCount: 3 },
    { name: 'contract_images', maxCount: 1 },
  ]),
  async (req, res) => {
    /*
        매물 등록하기 API
        realty_name : 매물 이름
        realty_type : 매물 종류
        realty_kind : 거래 종류
        realty_all_floors : 전체 층수
        realty_my_floors : 현재 층수
        deposit : 보증금
        monthly_rent : 월세
        maintenance_charge: 관리비
        realty_comment: 상세설명
        addr: 주소
        addr_detail : 상세주소
        addr_extra : 여분주소
        post_num : 우편번호
        lat : 위도
        lng : 경도
        realty_subcomment : 추가설명
        realty_options : 옵션
        oper_start_time :대여시간
        oper_end_time : 종료시간
        realty_status,

    */

    const {
      realty_name,
      realty_type,
      realty_kind,
      realty_all_floors,
      realty_my_floors,
      deposit,
      monthly_rent,
      maintenance_charge,
      realty_comment,
      addr,
      addr_detail,
      addr_extra,
      region_1depth_name,
      region_2depth_name,
      region_3depth_name,
      post_num,
      lat,
      lng,
      realty_subcomment,
      realty_options,
      oper_start_time,
      oper_end_time,
      realty_status,
    } = req.body;

    const realty_images = req.files['realty_images'];
    const contract_images = req.files['contract_images'][0].path;
    const realtyImages = realty_images ? realty_images.map(ob => ob.path) : [];

    const { user_id } = req.decodeToken;

    try {
      const new_user_id = parseInt(user_id);
      const new_lat = parseFloat(lat);
      const new_lng = parseFloat(lng);
      const new_realty_type = parseInt(realty_type);
      const new_monthly_rent = parseInt(monthly_rent);
      const new_maintenance_charge = parseInt(maintenance_charge);
      const operStartTime = new Date(oper_start_time); // Date 형 변환
      const operEndTime = new Date(oper_end_time); // Date 형 변환

      const createRealty = await Realty.create({
        user_id: new_user_id,
        realty_name,
        realty_type,
        realty_kind,
        realty_all_floors,
        realty_my_floors,
        deposit,
        monthly_rent: new_monthly_rent,
        maintenance_charge: new_maintenance_charge,
        realty_comment,
        addr,
        addr_detail,
        addr_extra,
        region_1depth_name,
        region_2depth_name,
        region_3depth_name,
        post_num,
        lat: new_lat,
        lng: new_lng,
        realty_subcomment,
        realty_options,
        realty_images: realtyImages,
        oper_start_time: operStartTime,
        oper_end_time: operEndTime,
        realty_status,
        realty_contract_images: contract_images,
        realty_type: new_realty_type,
      });
      if (!createRealty) {
        return res.status(202).send({ message: '매물 등록에 실패하였습니다.' });
      }
      return res.status(200).send({ message: 'success', data: createRealty });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ message: 'db error' });
    }
  }
);

/* 매물 삭제하기 */

router.delete('/:realty_id', verifyToken, async (req, res) => {
  const { realty_id } = req.params;
  const { user_id } = req.decodeToken;
  try {
    const REALTY_ID = parseInt(realty_id);
    const existRealty = await Realty.findOne({
      where: { realty_id: REALTY_ID },
    });

    if (!existRealty) {
      return res.status(202).send({ message: '존재하지 않는 매물입니다.' });
    }
    const deleteRealty = await Realty.destroy({
      where: { realty_id: REALTY_ID, user_id },
    });
    if (!deleteRealty) {
      return res
        .status(202)
        .send({ message: '매물을 삭제중 오류가 발생하였습니다.' });
    }
    return res.status(200).send({ message: 'success' });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ message: 'db error' });
  }
});

module.exports = router;

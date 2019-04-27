const express = require('express');
const createError = require('http-errors');
const router = express.Router();

const User = require('../models/user');
const Beer = require('../models/beer');
const Bar = require('../models/bar');
const Event = require('../models/event');
const Review = require('../models/review');

const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'img',
  allowedFormats: ['jpg', 'png'],
  transformation: [{ width: 150, height: 150, crop: 'limit' }],
});

const parser = multer({ storage });

// const {
//   isLoggedIn,
//   isNotLoggedIn,
//   validationLoggin,
// } = require('../helpers/middlewares');


/* POST  createBar page */ 

router.post('/createBar', (req, res, next) => {
    const {barType, name, street, neighbourhood, city, categoryType, music, disabled, BeersDraft, BeersBottle} = req.body;
    const creator = req.session.currentUser._id;
    // let location = {
    //   type: 'Point',
    //   coordinates: [req.body.longitude, req.body.latitude]
    //   };
    Bar.findOne({name})
      .then((nameBar) => {
        if(nameBar){
          next(createError(404), 'This bar already exists');
        } else {
          Bar.create({
            barType,
            name,
            address:{  
            street,
            neighbourhood,
            city,
            },
            category:{
              categoryType, 
              music, 
              disabled,
            },
            BeersDraft,
            BeersBottle,
            creator,
            // location,
          })
          .then((bar) => {
            return res.status(200).json(bar);
    
          })
          .catch((error) => {
            next(error);
          })
        .catch((error) => {
          next(error);
        });
        };
      });
    });

/* POST  updateBar page */

router.post('/:idBar/updateBar', (req, res, next) => {
  const {barType, name, street, neighbourhood, city, categoryType, music, disabled, BeersDraft, BeersBottle} = req.body;
  const {idBar} = req.params;
  Bar.findByIdAndUpdate(idBar, {barType, name, street, neighbourhood, city, categoryType, music, disabled, BeersDraft, BeersBottle})
    .then((bar) => {
      return res.status(200).json(bar);
    }) 
    .catch((error) => {
      next(error);
    })
});
/* POST  deleteBar page */

router.post('/:idBar/deleteBar', (req, res, next) => {
  const {idBar} = req.params;
  Bar.findByIdAndDelete(idBar)
    .then((bar) => {
      return res.status(200).json(bar);
    }) 
    .catch((error) => {
      next(error);
    })
});

/* GET-POST page create beer Form */

router.post('/createBeer', (req, res, next) => {
  
  const {name, description} = req.body;
  Beer.create({
    name,
    description,
  })
  .then((beer) => {
    return res.status(200).json(beer);
  })
  .catch(error => {
    console.log(error);
  })
});

/* GET-POST  updateBeer page and updateFORM */

router.post('/:idBeer/updateBeer', (req, res, next) => {
  
  const {id} = req.params;
  const {name, description} = req.body;
  Beer.findByIdAndUpdate(id, {name, description})
    .then((beer) => {
      return res.status(200).json(beer);
    }) 
    .catch((error) => {
      next(error);
    })
});


/* POST  deleteBeer page */

router.post('/:idBeer/deleteBeer', (req, res, next) => {
  const {idBeer} = req.params;
  Beer.findByIdAndDelete(idBeer)
    .then((beer) => {
      return res.status(200).json(beer);
    }) 
    .catch((error) => {
      next(error);
    })
});


/* GET-POST page create REVIEW Form */

router.post('/newReview', (req, res, next) => {
  
  const {title,
          comment, 
          barID,
          ratingBeer,
          ratingToilet,
          ratingMusic,
          image} = req.body;
  const creator = req.session.currentUser._id;

  Review.create({
    title,
    comment, 
    barID,
    ratingBeer,
    ratingToilet,
    ratingMusic,
    image,
    creator,
  })
  .then((review) => {
    return res.status(200).json(review);
  })
  .catch(error => {
    console.log(error);
  })
});

/* POST  deleteBeer page */

router.post('/:idReview/deleteReview', (req, res, next) => {
  const {idReview} = req.params;
  Review.findByIdAndDelete(idReview)
    .then((review) => {
      return res.status(200).json(review);
    }) 
    .catch((error) => {
      next(error);
    })
});


module.exports = router;

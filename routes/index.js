const express = require('express');

const {
  getProductByCategories,
  getSearch,
  getAbout,
  getTermsOfUse
} = require('../controllers/index');

//Main Routes - simplified for now

const router = express.Router();

router.route('/search').get(getSearch);
router.route('/about').get(getAbout);
router.route('/terms_of_use').get(getTermsOfUse);

module.exports = router;

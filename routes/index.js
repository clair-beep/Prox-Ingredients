const express = require('express');

const {
  getAbout,
  getTermsOfUse,
  getPrivacPolicy,
} = require('../controllers/index');

//Main Routes - simplified for now

const router = express.Router();

router.route('/about').get(getAbout);
router.route('/terms_of_use').get(getTermsOfUse);
router.route('/privacy-policy').get(getPrivacPolicy);

module.exports = router;

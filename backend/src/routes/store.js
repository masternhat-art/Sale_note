const storeController = require('../controllers/storeController');
const express = require('express');
const router = express.Router();

router.use('/add', storeController.add);
router.use('/edit', storeController.edit);
router.use('/', storeController.show);

module.exports = router;
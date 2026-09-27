const storeController = require('../controllers/storeController');
const express = require('express');
const router = express.Router();

router.post('/add', storeController.add);
router.get('/', storeController.show);
router.put('/:slug/edit', storeController.edit);
router.delete('/:slug/delete', storeController.delete);
module.exports = router;
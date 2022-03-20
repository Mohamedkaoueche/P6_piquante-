const express = require('express');
const router = express.Router();

const sauceController = require('../controllers/Sauce');
const multerConfig = require('../helper/multer-helper');
const auth = require('../helper/auth-helper');


router.get('/', sauceController.getSauces);
router.get('/:id', sauceController.getSauce);
router.put('/:id', auth, multerConfig, sauceController.updateSauce);
router.delete('/:id', auth, sauceController.deleteSauce);
router.post('/', multerConfig, sauceController.addSauce);

module.exports = router;
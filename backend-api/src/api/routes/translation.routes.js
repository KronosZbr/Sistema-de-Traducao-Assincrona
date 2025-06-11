const { Router } = require('express');

const translationController = require('../controllers/translation.controller');

const router = Router();

router.post('/translations', translationController.create);

router.get('/translations/:id', translationController.getById);

module.exports = router;
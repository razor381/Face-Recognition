const router = require('express').Router();
const viewController = require('../Controllers/viewController');

router.get('/', viewController.getHome);
router.post('/analyze-face', viewController.uploadImage, viewController.analyzeFace);

module.exports = router;

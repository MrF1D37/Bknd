const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');
const { getImages, likeImage } = require('../controllers/image.controller');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(roleMiddleware(['consumer']));

// Routes
router.get('/images', getImages);
router.post('/images/:id/like', likeImage);

module.exports = router; 
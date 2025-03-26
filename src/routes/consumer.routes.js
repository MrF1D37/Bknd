const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');
const { getImages, likeImage } = require('../controllers/image.controller');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(roleMiddleware(['consumer']));

/**
 * @swagger
 * /api/consumer/images:
 *   get:
 *     summary: Get all images (for consumers)
 *     tags: [Consumer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   creatorId:
 *                     type: string
 *                   url:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   likes:
 *                     type: integer
 */
router.get('/images', getImages);

/**
 * @swagger
 * /api/consumer/images/{id}/like:
 *   post:
 *     summary: Like an image
 *     tags: [Consumer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 likes:
 *                   type: integer
 *       404:
 *         description: Image not found
 */
router.post('/images/:id/like', likeImage);

module.exports = router; 
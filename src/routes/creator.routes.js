const express = require('express');
const { body } = require('express-validator');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');
const { upload, uploadImage, getCreatorImages, deleteImage } = require('../controllers/image.controller');

const router = express.Router();

const uploadValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('location').optional().isObject().withMessage('Location must be an object'),
  body('location.latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('location.name').optional().isString().withMessage('Location name must be a string'),
  body('metadata').optional().isObject().withMessage('Metadata must be an object'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().isString().withMessage('Each tag must be a string')
];

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(roleMiddleware(['creator']));

/**
 * @swagger
 * /api/creator/upload:
 *   post:
 *     summary: Upload a new image
 *     tags: [Creator]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - title
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (max 5MB)
 *               title:
 *                 type: string
 *                 description: Image title
 *               description:
 *                 type: string
 *                 description: Image description (optional)
 *               location:
 *                 type: object
 *                 description: Location information (optional)
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     description: Latitude coordinate (-90 to 90)
 *                   longitude:
 *                     type: number
 *                     description: Longitude coordinate (-180 to 180)
 *                   name:
 *                     type: string
 *                     description: Location name/address
 *               metadata:
 *                 type: object
 *                 description: Additional image metadata (optional)
 *                 properties:
 *                   camera:
 *                     type: string
 *                     description: Camera used
 *                   settings:
 *                     type: object
 *                     description: Camera settings
 *                   dateTaken:
 *                     type: string
 *                     format: date-time
 *                     description: Date when the image was taken
 *               tags:
 *                 type: array
 *                 description: Array of tags for the image
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 */
router.post('/upload', upload.single('image'), uploadValidation, uploadImage);

/**
 * @swagger
 * /api/creator/my-images:
 *   get:
 *     summary: Get all images uploaded by the creator
 *     tags: [Creator]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of creator's images
 */
router.get('/my-images', getCreatorImages);

/**
 * @swagger
 * /api/creator/images/{id}:
 *   delete:
 *     summary: Delete an image
 *     tags: [Creator]
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
 *         description: Image deleted successfully
 *       403:
 *         description: Not authorized to delete this image
 *       404:
 *         description: Image not found
 */
router.delete('/images/:id', deleteImage);

module.exports = router; 
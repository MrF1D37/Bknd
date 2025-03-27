const multer = require('multer');
const Image = require('../models/image.model');
const blobService = require('../services/blob.service');
const { validationResult } = require('express-validator');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

const uploadImage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Generate unique filename and upload to blob storage
    const filename = blobService.generateUniqueFileName(req.file.originalname);
    const imageUrl = await blobService.uploadImage(req.file, filename);

    // Create image record in database
    const image = await Image.create({
      id: Date.now().toString(),
      creatorId: req.user.id,
      url: imageUrl,
      filename: filename,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location || null,
      tags: req.body.tags || null
    });

    res.status(201).json({
      message: 'Image uploaded successfully',
      image
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};

const getImages = async (req, res) => {
  try {
    const images = await Image.getAll();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images', error: error.message });
  }
};

const getCreatorImages = async (req, res) => {
  try {
    const images = await Image.findByCreatorId(req.user.id);
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching creator images', error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (image.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this image' });
    }

    // Delete from blob storage
    await blobService.deleteImage(image.filename);
    
    // Delete from database
    await Image.delete(req.params.id);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
};

const likeImage = async (req, res) => {
  try {
    const image = await Image.incrementLikes(req.params.id);
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: 'Error liking image', error: error.message });
  }
};

module.exports = {
  upload,
  uploadImage,
  getImages,
  getCreatorImages,
  deleteImage,
  likeImage
}; 
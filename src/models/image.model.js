const { container } = require('../config/database');

class Image {
  constructor(id, creatorId, url, title, description, location, metadata, tags) {
    this.id = id;
    this.creatorId = creatorId;
    this.url = url;
    this.title = title;
    this.description = description;
    this.location = location || null;
    this.metadata = metadata || {};
    this.tags = tags || [];
    this.createdAt = new Date();
    this.likes = 0;
  }

  static async create(imageData) {
    const image = new Image(
      imageData.id,
      imageData.creatorId,
      imageData.url,
      imageData.title,
      imageData.description,
      imageData.location,
      imageData.metadata,
      imageData.tags
    );

    const { resource } = await container.items.create(image);
    return resource;
  }

  static async findByCreatorId(creatorId) {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.creatorId = @creatorId',
      parameters: [{ name: '@creatorId', value: creatorId }]
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }

  static async getAll() {
    const querySpec = {
      query: 'SELECT * FROM c ORDER BY c.createdAt DESC'
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }

  static async findById(id) {
    const { resource } = await container.item(id, id).read();
    return resource;
  }

  static async incrementLikes(id) {
    const image = await this.findById(id);
    image.likes += 1;
    const { resource } = await container.item(id, id).replace(image);
    return resource;
  }
}

module.exports = Image; 
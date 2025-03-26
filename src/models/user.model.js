const { container } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(id, email, password, role) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role; // 'creator' or 'consumer'
    this.createdAt = new Date();
  }

  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User(
      userData.id,
      userData.email,
      hashedPassword,
      userData.role
    );

    const { resource } = await container.items.create(user);
    return resource;
  }

  static async findByEmail(email) {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.email = @email',
      parameters: [{ name: '@email', value: email }]
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources[0];
  }

  static async findById(id) {
    const { resource } = await container.item(id, id).read();
    return resource;
  }
}

module.exports = User; 
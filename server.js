require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/config/swagger');
const authRoutes = require('./src/routes/auth.routes');
const creatorRoutes = require('./src/routes/creator.routes');
const consumerRoutes = require('./src/routes/consumer.routes');
const { errorHandler } = require('./src/middleware/error.middleware');
const { authMiddleware } = require('./src/middleware/auth.middleware');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/creator', authMiddleware, creatorRoutes);
app.use('/api/consumer', authMiddleware, consumerRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});
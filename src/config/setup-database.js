const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config();

async function setupDatabase() {
  const client = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
  });

  try {
    // Create database if it doesn't exist
    const { database } = await client.databases.createIfNotExists({
      id: 'tbatbdata_db',
      offerThroughput: 400
    });

    console.log('Database created/verified:', database.id);

    // Create container if it doesn't exist
    const { container } = await database.containers.createIfNotExists({
      id: 'images',
      partitionKey: { paths: ['/id'] },
      indexingPolicy: {
        indexingMode: 'consistent',
        automatic: true,
        includedPaths: [
          { path: '/id/?' },
          { path: '/creatorId/?' },
          { path: '/createdAt/?' }
        ],
        excludedPaths: []
      }
    });

    console.log('Container created/verified:', container.id);

    // Update .env with the actual database and container names
    const fs = require('fs');
    const envPath = '.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent = envContent.replace(
      /COSMOS_DATABASE=.*/,
      'COSMOS_DATABASE=tbatbdata_db'
    );
    
    envContent = envContent.replace(
      /COSMOS_CONTAINER=.*/,
      'COSMOS_CONTAINER=images'
    );
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase(); 
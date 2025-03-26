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
      id: 'tbatbdata_db'
    });

    console.log('Database created/verified:', database.id);

    // Create images container if it doesn't exist
    const { container: imagesContainer } = await database.containers.createIfNotExists({
      id: 'images',
      partitionKey: { paths: ['/id'] },
      indexingPolicy: {
        indexingMode: 'consistent',
        automatic: true,
        includedPaths: [
          { path: '/creatorId/?' },
          { path: '/createdAt/?' },
          { path: '/title/?' },
          { path: '/description/?' },
          { path: '/likes/?' }
        ],
        excludedPaths: [
          { path: '/*' }
        ]
      }
    });

    console.log('Images container created/verified:', imagesContainer.id);

    // Create users container if it doesn't exist
    const { container: usersContainer } = await database.containers.createIfNotExists({
      id: 'users',
      partitionKey: { paths: ['/id'] },
      indexingPolicy: {
        indexingMode: 'consistent',
        automatic: true,
        includedPaths: [
          { path: '/email/?' },
          { path: '/role/?' }
        ],
        excludedPaths: [
          { path: '/*' }
        ]
      }
    });

    console.log('Users container created/verified:', usersContainer.id);

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
    console.log('Note: Please ensure to set the minimum RU/s (400) in the Azure Portal');
    console.log('This setup is optimized for the free tier and student usage.');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase(); 
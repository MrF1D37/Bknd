const express = require('express');
const app = express();
const port = 3000;

// Root route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/creator', (req, res) => {
    res.send('Upload your view!');
  });

  app.get('/consumer', (req, res) => {
    res.send('like and share!');
  });

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
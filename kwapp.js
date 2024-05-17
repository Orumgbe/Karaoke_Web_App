import express from 'express';
import router from './router';

// Initialize app instance and define port
const app = express();
const port = 3000;

// Load routes using express.Router
app.use('/', router);

// Set listen port
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

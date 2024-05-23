import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import router from './router';

// Initialize app instance and define port
const app = express();
const port = 3000;

// Data parsing
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files and templates
app.use(express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');

// Load routes using express.Router
app.use('/', router);

// Set listen port
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

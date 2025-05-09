import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Blog from './models/blog.js';
import User from './models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/bloglist', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a new user
app.post('/api/users', async (req, res) => {
  const { username, name, password } = req.body;
  
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

// User login and token generation
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  res.status(200).send({ token, username: user.username, name: user.name });
});

// API routes for getting, adding, and deleting blog posts
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

app.post('/api/blogs', async (req, res) => {
  const { title, author, url, likes, user } = req.body;

  const blog = new Blog({ title, author, url, likes, user });
  const savedBlog = await blog.save();
  res.json(savedBlog);
});

app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  await Blog.findByIdAndRemove(id);
  res.status(204).end();
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Blog from './models/blog.js';
import User from './models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { config } from 'dotenv';

config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware for token validation
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (req, res, next) => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    req.user = await User.findById(decodedToken.id);
  }
  next();
};

app.use(tokenExtractor);
app.use(userExtractor);

// API routes for getting, adding, and deleting blog posts
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

app.post('/api/blogs', async (req, res) => {
  const { title, author, url, likes } = req.body;
  const blog = new Blog({ title, author, url, likes, user: req.user._id });
  const savedBlog = await blog.save();
  req.user.blogs = req.user.blogs.concat(savedBlog._id);
  await req.user.save();
  res.json(savedBlog);
});

app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (blog.user.toString() === req.user._id.toString()) {
    await Blog.findByIdAndRemove(id);
    res.status(204).end();
  } else {
    res.status(403).json({ error: 'You do not have permission to delete this blog' });
  }
});

// User signup and login
app.post('/api/users', async (req, res) => {
  const { username, name, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({ username, name, passwordHash });
  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'invalid username or password' });
